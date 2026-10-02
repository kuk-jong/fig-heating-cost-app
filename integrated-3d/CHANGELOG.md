# CHANGELOG

## 0.2.0 — 통합 프로토타입 구현 (2026-10-02)
### Added
- 통합 앱 `index.html`, `styles.css`, `app.js` 구현
- 지역/재배방식/온실/기밀도/방풍벽/생산/난방/시설투자 입력 UI
- 기본 8×42m, 측고 2.5m, 동고 4m, 3연동 적용
- 300평 기준 생산량의 면적비례 자동 환산
- 300평 기준 투자비의 면적비례 감가상각
- 여름/겨울/연간 순이익 카드와 매출·난방비·감가상각 비교
- 동일 온실 치수를 사용하는 현실형 Three.js 3D 온실
- 외부/내부/골조 및 사선/정면/측면/평면 보기

### Changed
- 없음. 기존 main/v2-3d 및 fig-heating-decision-app 원본은 보존.

### Calculation impact
- 신규 통합 프로토타입에 계산 레이어가 생김.
- 생산량, 판매단가, 경영비율, 투자비/내용연수는 기존 의사결정 앱 설계 기준을 반영.
- 난방비는 아직 구조 검증용 간이 지역 Degree-Hour 값으로 계산하며 최종값으로 사용하지 않음.

### Validation
- 온실면적 = 폭 × 길이 × 연동수로 계산/3D 공유.
- 여름재배(관행) 선택 시 겨울 생산량/매출/난방비/감가상각이 0이 되도록 구현.
- 기밀도와 방풍벽 계수는 난방비 계산에만 적용.
- 다음 단계에서 원본 fig-heating-decision-app 계산식과 동일 입력 기준 회귀검증 예정.

### Next
- 원본 10년 기상/난방 계산식 정확 이식
- 민감도 분석 구현
- 방풍벽을 3D 형상에도 시각화
- 투자비 개별 수정값과 자동 면적환산 UX 개선
- 기준 시나리오 회귀테스트 작성

## 0.1.0 — 통합 설계 착수 (2026-10-02)
### Added
- `integrated-decision-3d` 독립 개발 브랜치 생성
- `integrated-3d/FRAMEWORK.md` 생성
- `integrated-3d/UML.md` 생성
- 기존 fig-heating-decision-app의 핵심 기능을 통합 범위로 정의
- 기존 v2-3d 현실형 온실을 시각화 기반으로 채택
- Single Source of Truth 원칙 정의

### Preserved
- fig-heating-decision-app 원본 변경 없음
- fig-heating-cost-app main 및 v2-3d 원본 변경 없음

### Calculation impact
- 없음. 이번 변경은 설계/문서 단계이며 계산식은 변경하지 않음.

## 변경 시 필수 기록
각 변경은 Added / Changed / Fixed / Calculation impact / Validation 항목을 기록한다. 계산식 변경 시 기존값과 변경값의 비교 검증 결과를 반드시 남긴다.
