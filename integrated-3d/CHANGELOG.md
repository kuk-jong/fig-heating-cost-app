# CHANGELOG

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

### Next
- 통합 앱 UI shell 구축
- GreenhouseModel/ProductionPlan/InvestmentPlan/HeatingCondition 데이터 모델 구현
- 기존 의사결정 계산식 이식 및 기준값 회귀검증
- 현실형 3D GreenhouseModel 연동
- 경영분석 및 민감도 대시보드 구현

## 변경 시 필수 기록
각 변경은 Added / Changed / Fixed / Calculation impact / Validation 항목을 기록한다. 계산식 변경 시 기존값과 변경값의 비교 검증 결과를 반드시 남긴다.
