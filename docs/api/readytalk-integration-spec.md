# 레디톡 연동 스펙 문서

이 문서는 레디톡 개발팀에 전달하는 서버 연동 기준 문서입니다.

## 기본 사항

- 운영 기준 Base URL: `https://offlinesales.vercel.app`
- 인증 방식: 모든 요청에 `x-api-key: <READYTALK_API_KEY>` 헤더를 포함합니다.
- Content-Type: `application/json`
- 권장 타임아웃: 3초 이내
- 재시도 정책: 네트워크 오류 또는 `5xx` 응답일 때만 재시도합니다.
- 추적 값: 모든 응답에는 `requestId` JSON 필드와 `x-request-id` 헤더가 포함됩니다.

## 1. 추천인코드 검증 API

### 목적

- 레디톡에서 추천인코드 입력 시 즉시 유효성 확인
- 비활성 코드, 재발급으로 폐기된 구코드 차단
- 필요 시 매칭된 파트너 정보 확인

### Endpoint

`POST https://offlinesales.vercel.app/api/integrations/readytalk/referral-codes/verify`

### Request

```json
{
  "code": "RTM4K82"
}
```

### 성공 응답

```json
{
  "data": {
    "valid": true,
    "code": "RTM4K82",
    "partnerId": "0c1b54e7-4fdf-4e6d-b2e6-4f6970fc96df",
    "partnerName": "Partner Name",
    "partnerEmail": "partner@example.com",
    "status": "active",
    "approvedAt": "2026-04-20T11:30:00+09:00"
  },
  "requestId": "1c3c74c1-1111-4444-9999-b387ded9f8a0"
}
```

### 유효하지 않은 코드 응답

유효하지 않은 입력도 레디톡에서 업무 처리 가능한 실패로 다루기 쉽도록 `200`으로 응답합니다.

```json
{
  "data": {
    "valid": false,
    "code": "RTM4K82",
    "reason": "not_found_or_inactive"
  },
  "requestId": "1c3c74c1-1111-4444-9999-b387ded9f8a0"
}
```

### 실패 응답 코드

- `400`: 요청 형식 오류
- `401`: API 키 누락 또는 불일치
- `500`: 서버 설정 누락 또는 내부 처리 오류

## 2. 파일럿 시작 webhook

### 목적

- 레디톡에서 실제 파일럿 시작이 확정된 건을 오프라인세일즈로 전달
- 서버에서 추천인코드를 한 번 더 검증
- 내부 `merchant_leads` 구조에 맞춰 실적 저장
- `eventId` 기준 멱등 처리

### Endpoint

`POST https://offlinesales.vercel.app/api/webhooks/readytalk/pilot-started`

### Request

```json
{
  "eventId": "evt_20260420_001",
  "merchantExternalId": "merchant_12345",
  "storeName": "Ready Coffee Seongsu",
  "contactPhone": "010-2222-3333",
  "region": "Seoul Seongdong-gu",
  "referralCode": "RTM4K82",
  "pilotStartedAt": "2026-04-20T14:00:00+09:00"
}
```

### 성공 응답

```json
{
  "data": {
    "accepted": true,
    "duplicate": false,
    "leadId": "93f9d55b-bd96-47b5-b0d0-2e3622634f09",
    "partnerId": "0c1b54e7-4fdf-4e6d-b2e6-4f6970fc96df",
    "eventId": "evt_20260420_001",
    "merchantExternalId": "merchant_12345"
  },
  "requestId": "72f34d30-a8f1-4baa-864d-d7d3062f3d5a"
}
```

### 중복 재전송 응답

같은 `eventId`가 이미 정상 처리된 뒤 다시 들어오면 `200`으로 중복 성공 처리합니다.

```json
{
  "data": {
    "accepted": true,
    "duplicate": true,
    "leadId": "93f9d55b-bd96-47b5-b0d0-2e3622634f09",
    "eventId": "evt_20260420_001",
    "merchantExternalId": "merchant_12345"
  },
  "requestId": "72f34d30-a8f1-4baa-864d-d7d3062f3d5a"
}
```

### 실패 응답 코드

- `400`: 요청 형식 오류
- `401`: API 키 누락 또는 불일치
- `409`: 동일 매장/연락처 기준으로 이미 다른 문맥의 리드가 존재함
- `422`: 추천인코드가 유효하지 않거나 비활성 상태임
- `500`: 서버 설정 누락 또는 내부 처리 오류

## 3. 운영 규칙

- 유효한 코드는 `active` 상태 파트너의 현재 추천인코드만 인정합니다.
- 추천인코드가 재발급되면 이전 코드는 즉시 무효입니다.
- 레디톡은 추천인코드 입력 시점에 1차 검증을 수행해야 합니다.
- 레디톡은 파일럿 시작 이벤트 전송 직전에 2차 검증을 다시 수행해야 합니다.
- 코드 유효성은 장시간 캐시하지 않는 것을 권장합니다.

## 4. 내부 처리 방식 참고

- 서버는 `integration_events` 테이블에 webhook 수신 이력을 저장합니다.
- 멱등성 기준은 `(provider, event_type, event_id)` 입니다.
- 처리 완료된 이벤트는 내부 `merchant_leads` 와 연결되어 추후 정산 및 운영 확인에 사용됩니다.
