# 루나소프트 카카오 알림톡 REST API Mocking 서버

## 필요항목
* node.js 7.6+
* Docker (선택사항)

## 환경설정

### 설정파일
`config/default.json` 파일에 기본 설정이 저장되어 있다. `NODE_ENV` 환경변수에 따라 추가 설정 파일을 생성해서 기본 설정을 오버라이드할 수 있다.

예를 들어, `NODE_ENV=development` 이고, `config/development.json` 파일이 다음과 같이 정의되어 있다고 하자.

```json
{ "port": 9000 }
```

이 경우 `port` 설정은 `config/development.json` 파일에서 읽어오게 되며, 그 외의 설정값은 `config/default.json` 파일에서 읽어온다.

#### 설정항목
* `port`: 서버가 리스닝할 포트 번호. `LUNATALK_PORT` 환경 변수가 지정된 경우, 설정파일에 있는 값 대신 환경변수의 값을 사용한다. 
* `validUserId`: 유효한 Lunasoft 사용자 ID. 이 목록에 없는 사용자 ID를 요청하면 에러를 반환한다.
* `validTemplateId`: 유효한 템플릿 ID. 이 목록에 없는 템플릿 ID를 요청하면 에러를 반환한다.

### 패키지 설치
`npm` 또는 `yarn`을 사용해서 필요한 패키지를 설치한다. `yarn`이 다운로드 속도가 빠르다.

```bash
# npm 사용시
$ npm install

# yarn 사용시
$ yarn install
```

## 실행

### 로컬 실행
로컬에 설치된 node.js를 사용해서 실행한다.

```bash
# 기본 포트 (8000)에서 서버 실행
$ npm run app

# 8080번 포트에서 실행
$ LUNATALK_PORT=8080 npm run app
```

### 도커를 사용해 실행
```bash
# 도커 이미지 빌드
$ npm run dockerimage

# 생성된 도커 이미지를 사용해 실행
$ npm run docker

# 설정 파일 오버라이드
$ docker run -d -p 8000:8000 -v `pwd`/config/production.json:/app/config/production.json mock-lunatalk
```

도커를 사용해 실행하면서 설정 파일을 오버라이드할 때, 설정 파일 내의 `port` 설정은 변경하면 안된다. 대신 외부에 노출하는 포트 번호를 다른 포트 번호로 매핑하는 방식을 사용해야 한다.

예를 들어, `8000`포트 대신 `9090`포트를 사용하려는 경우 다음과 같이 실행한다:

```bash
$ docker run -d -p 9090:8000 mock-lunatalk
``` 
