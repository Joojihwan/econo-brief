# econo-brief — Project Schema

경제·산업 동향 및 주식투자 뉴스 요약 브리핑 웹 애플리케이션.

---

## Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Bundler | Vite | ^8 |
| UI Framework | React | ^19 |
| Language | TypeScript (TSX) | ^5 |
| Component Library | MUI / Material UI | ^6 |
| Styling | SCSS Modules (`*.module.scss`) | sass ^1 |
| State | React Context + `useReducer` (로컬), Zustand (글로벌 필요 시) | - |
| Data Fetching | TanStack Query (`@tanstack/react-query`) | ^5 |
| Routing | React Router DOM | ^7 |
| AI Summary API | Anthropic Claude API (`claude-sonnet-4-6`) | - |

---

## Architecture

```
econo-brief/
├── docs/
│   └── schema.md          # 이 파일
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── theme/
│   │   ├── index.ts        # MUI createTheme 설정
│   │   └── palette.ts      # 색상 토큰 정의
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── Home/           # 메인 브리핑 페이지 (산업동향 + 매크로)
│   │   │   ├── index.tsx
│   │   │   └── Home.module.scss
│   │   └── StockNews/      # 주식투자 뉴스 요약 페이지
│   │       ├── index.tsx
│   │       └── StockNews.module.scss
│   ├── components/
│   │   ├── BriefCard/      # 뉴스/동향 요약 카드
│   │   ├── MacroWidget/    # 매크로 지표 위젯 (금리, 환율 등)
│   │   ├── SectorChart/    # 섹터별 차트
│   │   └── common/         # 버튼, 스피너 등 재사용 UI
│   ├── hooks/
│   │   ├── useBriefing.ts  # 브리핑 데이터 fetch + 캐시
│   │   └── useMacro.ts     # 매크로 지표 fetch
│   ├── services/
│   │   ├── claudeApi.ts    # Claude API 호출 (요약 생성)
│   │   └── dataApi.ts      # 뉴스/경제 데이터 외부 API
│   ├── store/
│   │   └── briefingStore.ts # Zustand 전역 상태 (필요 시)
│   └── types/
│       ├── briefing.ts     # BriefItem, MacroData 등 도메인 타입
│       └── api.ts          # API 요청/응답 타입
├── index.html
├── vite.config.ts
└── tsconfig.json
```

### 페이지 구성

| Route | Page | 내용 |
|-------|------|------|
| `/` | Home | 산업 동향 요약 + 매크로 경제 지표 브리핑 |
| `/stock-news` | StockNews | 주식투자 뉴스 요약 + 관련 통계 |

---

## Token Efficiency Rules (Claude API)

AI 요약 기능에서 토큰 비용을 최소화하기 위한 규칙.

### 1. System Prompt 분리
- System prompt는 빌드 타임 상수(`src/services/claudeApi.ts`)에 정의, 요청마다 재구성하지 않음
- 역할 정의는 최대 100 토큰 이내로 유지

### 2. 입력 압축
- 뉴스 원문을 Claude에 전달하기 전, 클라이언트에서 제목 + 본문 첫 2문단만 추출하여 전송
- 중복 뉴스는 URL 기반 de-dup 후 제거

### 3. 응답 포맷 고정
Claude 응답은 구조화된 JSON으로 강제하여 파싱 오버헤드 제거:

```ts
// 요청 시 response_format 지시 (system prompt 내 포함)
// 응답 스키마
interface BriefSummary {
  headline: string;      // 1줄 핵심 요약
  bullets: string[];     // 3개 이내 불릿
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];        // 섹터/키워드 태그 (최대 3개)
}
```

### 4. 캐싱 전략
- TanStack Query `staleTime: 1000 * 60 * 30` (30분) — 동일 데이터 재요약 방지
- 요약 결과는 `localStorage`에 날짜 키로 저장, 당일 재방문 시 API 미호출

### 5. 배치 처리
- 뉴스 n건을 개별 요청이 아닌 단일 요청으로 묶어 요약 (`max_tokens` 상한 주의)
- 단일 배치 최대 뉴스 5건 / `max_tokens: 800`

---

## Styling Rules

- **SCSS Modules** 사용 — 전역 스타일 오염 방지
- MUI `sx` prop은 인라인 one-liner에만 사용, 복잡한 스타일은 SCSS Module로 분리
- MUI 테마 커스터마이징은 `src/theme/index.ts` 단일 파일에서 관리
- 색상 하드코딩 금지 — 테마 팔레트 토큰(`theme.palette.*`) 또는 SCSS 변수 사용

```scss
// src/theme/_variables.scss
$color-positive: #2e7d32;
$color-negative: #c62828;
$color-neutral:  #424242;
```

---

## Component Rules

- 파일당 컴포넌트 1개, 파일명 = 컴포넌트명 (PascalCase)
- Props 타입은 `interface ComponentNameProps` 형태로 동일 파일 상단에 정의
- 비즈니스 로직은 컴포넌트 밖 custom hook으로 분리 (`hooks/`)
- `React.FC` 사용 금지 — 함수 선언식 사용

```tsx
// Good
interface BriefCardProps {
  item: BriefItem;
}

export default function BriefCard({ item }: BriefCardProps) { ... }
```

---

## Commands

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트
npm run lint

# 패키지 설치 (최초 세팅)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install sass
npm install react-router-dom
npm install @tanstack/react-query
npm install -D typescript @types/react @types/react-dom
```

---

## Data Flow

```
외부 뉴스/경제 API
        │
   dataApi.ts  ──→  TanStack Query (캐시)
        │
   [원문 압축]  ──→  claudeApi.ts  ──→  Claude claude-sonnet-4-6
                                              │
                                    BriefSummary (JSON)
                                              │
                                    localStorage 캐시
                                              │
                                    BriefCard / MacroWidget
```

---

## Naming Conventions

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `BriefCard.tsx` |
| Hook | camelCase + `use` prefix | `useBriefing.ts` |
| 타입/인터페이스 | PascalCase | `BriefItem` |
| SCSS 클래스 | camelCase | `.briefCard` |
| 상수 | UPPER_SNAKE_CASE | `MAX_BATCH_SIZE` |
| API 함수 | camelCase + 동사 | `fetchBriefing()` |
