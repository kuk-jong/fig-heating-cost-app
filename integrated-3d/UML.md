# UML — 무화과 가온재배 3D 경영의사결정지원시스템

> Mermaid 지원 GitHub 화면에서 다이어그램으로 렌더링된다.

## 1. Use Case
```mermaid
flowchart LR
  Farmer((사용자)) --> A[분석지역 선택]
  Farmer --> B[온실 규격 입력]
  Farmer --> C[방풍벽/기밀도/보온조건 입력]
  Farmer --> D[여름·겨울 생산계획 입력]
  Farmer --> E[시설투자/에너지 조건 입력]
  Farmer --> F[기상 CSV 업로드]
  B --> G[현실형 3D 온실 확인]
  A --> H[난방비 분석]
  C --> H
  E --> H
  F --> H
  D --> I[경영성 분석]
  H --> I
  E --> I
  I --> J[여름/겨울/연간 성적표]
  I --> K[민감도 분석]
  I --> L[CSV 결과 저장]
```

## 2. Activity
```mermaid
flowchart TD
  S([시작]) --> I[입력값 로드]
  I --> V{입력 검증}
  V -- 오류 --> E[오류 안내] --> I
  V -- 정상 --> G[GreenhouseModel 생성]
  G --> C[기상자료/지역 파라미터 결합]
  C --> H[난방부하·난방비 계산]
  H --> P{재배방식}
  P -- 여름재배 --> S1[여름 경영성 계산]
  P -- 겨울재배 --> S2[여름 + 겨울 경영성 계산]
  S1 --> R[DecisionResult]
  S2 --> R
  R --> D[대시보드/민감도/3D 표시]
  D --> X([종료])
```

## 3. Class
```mermaid
classDiagram
  class GreenhouseModel {
    +width
    +length
    +sideHeight
    +ridgeHeight
    +spanCount
    +windbreak
    +airtightness
    +coverCondition
    +area()
    +surfaceArea()
  }
  class ProductionPlan {
    +cultivationMode
    +summerYield
    +winterYield
    +summerPrice
    +winterPrice
    +summerCostRatio
  }
  class InvestmentPlan {
    +doubleFilmWork
    +curtainWork
    +doubleFilmMaterial
    +curtainMaterial
    +annualDepreciation()
  }
  class HeatingCondition {
    +targetTemp
    +uValue
    +fuelPrice
    +efficiency
    +airtightnessFactor
    +windbreakFactor
  }
  class ClimateDataset {
    +region
    +hourlyTemperature
    +degreeHours()
  }
  class HeatingCalculator {
    +calculateLoad()
    +calculateCost()
  }
  class ProfitabilityCalculator {
    +summerResult()
    +winterResult()
    +annualResult()
    +sensitivity()
  }
  class Greenhouse3D {
    +render()
    +setMode()
    +setCamera()
  }
  class DecisionResult {
    +summerProfit
    +winterProfit
    +annualProfit
    +heatingCost
    +depreciation
  }
  GreenhouseModel --> HeatingCalculator
  HeatingCondition --> HeatingCalculator
  ClimateDataset --> HeatingCalculator
  HeatingCalculator --> ProfitabilityCalculator
  ProductionPlan --> ProfitabilityCalculator
  InvestmentPlan --> ProfitabilityCalculator
  ProfitabilityCalculator --> DecisionResult
  GreenhouseModel --> Greenhouse3D
```

## 4. Sequence
```mermaid
sequenceDiagram
  actor U as 사용자
  participant UI as Dashboard
  participant G as GreenhouseModel
  participant C as ClimateDataset
  participant H as HeatingCalculator
  participant P as ProfitabilityCalculator
  participant V as Greenhouse3D
  U->>UI: 조건 입력/변경
  UI->>G: 온실 모델 생성
  UI->>C: 지역/CSV 기상자료 요청
  G->>H: 외피면적/보정조건
  C->>H: 난방디그리아워
  H-->>P: 난방비
  UI->>P: 생산계획/투자비
  P-->>UI: 여름·겨울·연간 결과
  G->>V: 동일 온실 파라미터
  V-->>UI: 3D 렌더링
  UI-->>U: 성적표/차트/3D/민감도
```

## 변경관리 규칙
코드의 데이터 객체, 계산 흐름, 사용자 입력 또는 출력이 변경되면 해당 UML을 같은 변경 단위에서 수정한다.
