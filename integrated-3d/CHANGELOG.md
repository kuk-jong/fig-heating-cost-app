# CHANGELOG

## 0.3.0 — 기존 의사결정 계산모델 이식 (2026-10-02)
### Added
- 원본 22개 전남 시군 지역 base/amp 파라미터 이식
- 원본 아치형 지붕 외피면적 계산 이식
- 원본 2025-11-01~2026-02-28(120일) 겨울 분석 로직 이식
- 일별 모의 최저온도, 14시간 가온, 1월/11월/2월 생산 계절계수 이식
- 농사용 전기/면세유 발열량·효율·기본단가 이식
- 농사용 전기 최대부하 기반 기본요금 로직 이식
- 방풍벽 폭에 따른 보정효과 이식
- 방풍벽을 3D 모델에도 표시

### Changed
- 간이 Degree-Hour 난방비 계산을 원본 fig-heating-decision-app의 winter_analysis 방식으로 교체
- U값 직접입력을 원본 보온방식 선택으로 변경
- 투자비를 300평 기준 고정표시에서 실제 온실면적 자동 환산으로 변경

### Calculation impact
- 난방비 계산식이 원본 의사결정 앱 로직으로 변경됨.
- 여름/겨울 생산량과 투자비는 원본과 동일하게 300평(990㎡) 기준 면적비례 환산.
- 감가상각 내용연수: 공사 10년, 피복재 3년, 커튼자재 5년.

### Validation
- 원본 함수/상수 정의를 기준으로 JS 계산식을 대응 이식함.
- 계산과 3D가 width/length/side/ridge/spans를 공동 사용함.
- 관행 선택 시 겨울 매출/난방비/감가상각 0 유지.
- 다음 단계: 대표 시나리오별 Python 원본 결과와 JS 결과 수치 회귀검증 및 민감도 분석 UI 구현.

## 0.2.0 — 통합 프로토타입 구현 (2026-10-02)
### Added
- 통합 앱 `index.html`, `styles.css`, `app.js` 구현
- 지역/재배방식/온실/기밀도/방풍벽/생산/난방/시설투자 입력 UI
- 기본 8×42m, 측고 2.5m, 동고 4m, 3연동 적용
- 현실형 Three.js 3D 온실 및 경영분석 대시보드

### Calculation impact
- 프로토타입 단계의 간이 난방 계산 사용.

## 0.1.0 — 통합 설계 착수 (2026-10-02)
### Added
- `integrated-decision-3d` 독립 개발 브랜치 생성
- `FRAMEWORK.md`, `UML.md`, `CHANGELOG.md` 생성
- Single Source of Truth 원칙 정의

### Preserved
- fig-heating-decision-app 원본 변경 없음
- fig-heating-cost-app main 및 v2-3d 원본 변경 없음

## 변경 시 필수 기록
각 변경은 Added / Changed / Fixed / Calculation impact / Validation 항목을 기록한다. 계산식 변경 시 기존값과 변경값의 비교 검증 결과를 반드시 남긴다.
