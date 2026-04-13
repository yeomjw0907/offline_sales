# Kakao OAuth 설정 가이드

NextAuth v5 + Kakao 로그인 연동을 위한 설정 방법입니다.

---

## 1. Kakao Developers 앱 생성

1. https://developers.kakao.com 접속 → 카카오 계정으로 로그인
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 이름: `ReadyTalk 파트너` (원하는 이름 가능)
4. 사업자명 입력 후 저장

---

## 2. REST API 키 확인

1. 생성한 앱 클릭 → **앱 설정** → **앱 키**
2. **REST API 키** 복사 → `.env.local`의 `KAKAO_CLIENT_ID`에 입력

---

## 3. 플랫폼(Web) 등록

1. **앱 설정** → **플랫폼** → **Web 플랫폼 등록**
2. 아래 도메인 등록:
   - `http://localhost:3000`
   - `https://[Vercel 배포 도메인]` (배포 후 추가)

---

## 4. 카카오 로그인 활성화

1. **제품 설정** → **카카오 로그인**
2. **활성화 설정**: ON으로 변경

---

## 5. Redirect URI 등록

1. **제품 설정** → **카카오 로그인** → **Redirect URI**
2. 아래 URI 등록:

| 환경 | URI |
|---|---|
| 개발 | `http://localhost:3000/api/auth/callback/kakao` |
| 운영 | `https://[Vercel 배포 도메인]/api/auth/callback/kakao` |

---

## 6. Client Secret 설정 (보안 강화 권장)

1. **제품 설정** → **카카오 로그인** → **보안**
2. **Client Secret 코드 생성** 클릭
3. **활성화 상태**: 사용으로 변경
4. 생성된 코드 복사 → `.env.local`의 `KAKAO_CLIENT_SECRET`에 입력

---

## 7. 동의항목 설정

1. **제품 설정** → **카카오 로그인** → **동의항목**
2. 아래와 같이 설정:

| 항목 | 설정 |
|---|---|
| 닉네임 | 필수 동의 |
| 카카오계정(이메일) | 선택 동의 (권장) |
| 프로필 사진 | 선택 동의 |

---

## 8. .env.local 파일 작성

프로젝트 루트의 `.env.local.example`을 복사해서 `.env.local`로 만들고 아래 값 입력:

```env
KAKAO_CLIENT_ID=여기에_REST_API_키_입력
KAKAO_CLIENT_SECRET=여기에_Client_Secret_코드_입력
AUTH_SECRET=랜덤_비밀키  # openssl rand -base64 32
NEXT_PUBLIC_SUPABASE_URL=https://ixgfxlyqqquywrbohwpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=여기에_Service_Role_키_입력
NEXTAUTH_URL=http://localhost:3000
```

### SUPABASE_SERVICE_ROLE_KEY 확인

1. https://supabase.com/dashboard/project/ixgfxlyqqquywrbohwpe/settings/api 접속
2. **Project API keys** → **service_role** 키 복사
> ⚠️ service_role 키는 절대 `NEXT_PUBLIC_` 없이 사용하세요

### AUTH_SECRET 생성

```bash
openssl rand -base64 32
```

---

## 9. 완료 확인

```bash
npm run dev
# http://localhost:3000/login → 카카오 로그인 → /partner 리다이렉트 확인
```
