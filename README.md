# 루나소프트 카카오 알림톡 REST API Mocking 서버

## 필요항목
* node.js 7.6+
* Docker (선택사항)

## 환경설정

### 설정파일
`config/config.examplee.js` 파일을 `config/config.js`.파일로 복사한다.

* `config/config.example.js`: 설정 예제 파일
* `config/config.js`: 개발시 사용할 설정 파일. 버전 관리 대상에서 제외되어 있다.

#### 설정항목
* `PORT`: 서버가 리스닝할 포트 번호. 실행시에 포트 번호를 변경하고 싶다면 `LUNATALK_PORT` 환경변수를 지정해서 실행한다.
* `VALID_USER_ID`: 유효한 Lunasoft 사용자 ID. 이 목록에 없는 사용자 ID를 요청하면 에러를 반환한다.
* `VALID_TEMPLATE_ID`: 유효한 템플릿 ID. 이 목록에 없는 템플릿 ID를 요청하면 에러를 반환한다.

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
# 서버 실행
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

# `config/myconfig.js` 설정파일을 사용해 실행
$ docker run -d -v `pwd`/config/myconfig.js:/app/config/config.js mock-lunatalk
```

별도의 설정 파일을 사용해 실행할 때, 설정 파일 내의 `PORT` 설정은 변경하면 안된다. 대신 외부에 노출하는 포트 번호를 변경하는 방식을 사용해야 한다.

예를 들어, `8000`포트 대신 `9090`포트를 사용하려는 경우 다음과 같이 실행한다:

```bash
$ docker run -d -v `pwd`/config/config.js:/app/config/config.js -p 9090:8000 mock-lunatalk
``` 
