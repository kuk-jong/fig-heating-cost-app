# UML · 현재 구현

기준: v0.14 / 2026-10-05. 함수 중심 JavaScript 앱이므로 아래 클래스 표기는 실제 class 선언이 아니라 모듈 책임과 데이터 구조를 나타냅니다.

## 모듈과 데이터 구조

```mermaid
classDiagram
  class Application {
    state
    render()
    commit(next)
    persist()
    wirePage()
    settings()
  }
  class Model {
    DEFAULTS
    REGIONS
    fresh()
    validate(raw)
    calculate(state)
    parseWeather(csv)
  }
  class AppState {
    version: 1
    title: string
    geometry: width length side ridge spans
    spacing: rowSpacing plantSpacing
    energy: region mode target hours insulation air wind windWidth energyPrice
    production: yields prices costRatios month
    investments: Investment[]
    weather: WeatherDay[]
    images: keyed URLs or dataURLs
  }
  class Investment {
    name: string
    amount: number
    years: number
  }
  class WeatherDay {
    day: MM-DD
    temp: number
  }
  class Viewer {
    mountViewer(holder,state,options)
    dispose()
  }
  class Planting {
    plantingLayout(state)
    plantingPlan(state)
  }
  class Equipment {
    addEquipment(THREE,group,state,options)
  }
  class Business {
    renderBusiness(state,result)
    bindBusiness(root,state,result)
  }
  class CloudWorkspace {
    email
    revision
    load()
    save(state)
    logout()
  }
  Application --> Model
  Application --> AppState
  AppState *-- Investment
  AppState *-- WeatherDay
  Application --> Viewer
  Application --> Planting
  Application --> Business
  Application --> CloudWorkspace
  Viewer --> Planting
  Viewer --> Equipment
```

AppState의 geometry·spacing·energy·production은 설명용 분류입니다. 실제 JSON은 계층화하지 않고 width·length·month 등을 바로 포함합니다. Investment.amount는 300평 기준 만원, WeatherDay.temp는 ℃입니다.

## 입력 변경 시퀀스

```mermaid
sequenceDiagram
  actor User as 사용자
  participant UI as app.js
  participant Model as model.js
  participant Local as localStorage
  participant View as 화면 / 3D
  User->>UI: 입력 변경
  UI->>UI: 입력 범위 확인 · state 복제
  UI->>Model: validate(next)
  alt 검증 성공
    Model-->>UI: 검증된 상태
    UI->>Local: JSON 저장
    Note over UI,Local: 용량 초과 시 저장 실패 안내
    UI->>Model: calculate(state)
    Model-->>UI: 계산 결과
    UI->>View: 기존 3D 정리 · HTML 재구성
    opt 온실설계 / 시뮬레이션
      UI->>View: mountViewer(state,options)
      View-->>UI: dispose 함수
    end
  else 검증 실패
    Model-->>UI: 오류
    UI-->>User: 안내 · 기존 상태 화면 복원
  end
```

## 선택형 클라우드 저장 시퀀스

```mermaid
sequenceDiagram
  actor User as 사용자
  participant UI as 콘텐츠 관리
  participant Cloud as cloud.js
  participant Auth as Firebase Auth
  participant DB as Firestore
  participant Storage as Storage
  User->>UI: 웹 설정 입력 · Google 로그인
  UI->>Cloud: connectCloud(config)
  Cloud->>Auth: Google 팝업 로그인
  Auth-->>Cloud: user.uid
  User->>UI: 클라우드 불러오기
  Cloud->>DB: users/uid/workspaces/studio-6 읽기
  DB-->>Cloud: state + revision
  UI->>UI: validate · 로컬 백업 · 화면 갱신
  User->>UI: 클라우드 저장
  Cloud->>DB: 현재 revision 확인
  alt 일치
    loop 새 dataURL 이미지
      Cloud->>Storage: users/uid/images/UUID-key 업로드
      Storage-->>Cloud: 다운로드 URL
    end
    Cloud->>DB: transaction에서 revision 재확인
    DB-->>Cloud: state + revision 증가 저장
  else 다른 기기에서 변경
    Cloud-->>UI: 파일 백업 후 최신 자료 불러오기 안내
  end
```

클라우드는 같은 UID의 개인 작업공간입니다. 공동 편집·자동 저장·공식 콘텐츠 게시 시스템이 아닙니다. 이미지 업로드 후 transaction이 실패하면 이미지가 남을 수 있어 정리가 별도로 필요합니다. Firebase 프로젝트와 규칙 적용은 실제 연결의 선행 조건입니다.
