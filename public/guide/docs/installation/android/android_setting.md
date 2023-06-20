# Crash/Log 설정하기
## Crash 설정하기
AppCatch를 통해 모바일 앱에서 발생하는 Crash를 수집하기 위한 설정 방법을 설명합니다.

#### 초기화 Option 설정
* CrashipConfig 객체를 생성해 Crash 전송에 필요한 초기 정보들을 설정해주세요.
* 발급 받은 인증 코드, 서버 주소, provider에 설정한 authority 정보를 입력해주세요.
* 클라이언트 정보는 endUser 에 설정해 주세요.
=== "Kotlin"
    ``` kotlin
    val crashipConfig = CrashipConfig(pks, serverUrl, authority)
    CrashipConfig.endUser = "endUser"
    ```
=== "Java"
    ``` java
    CrashipConfig crashipConfig = new CrashipConfig(pks, serverUrl, authority);
    CrashipConfig.cf.endUser = "endUser";
    ```
* 초기화 실패했을 경우 재시도에 대한 규칙을 정의해주세요. (선택)
* 기본 값으로 retry는 true, period는 intArrayOf(5, 30, 60, 600)으로 설정되어 있습니다.
* 기본 동장 방식은 첫시도가 실패했을 경우 두번째 시도는 5초뒤, 세번째 시도는 30초뒤, 네번째 시도는 60초 뒤, 다섯번째 시도는 600초 뒤에 시도하는 방식입니다.
* retry 값이 true로 설정되었으므로 그 다음 시도는 다시 5초부터 시작하며 위와 같은 방식으로 성공할 때까지 반복해서 재시도합니다.

* retry와 period 설정에 따른 동작 방식     
    * retry 값이 false일 경우 period 배열의 값만큼만 재시도하고 끝납니다.
    * retry 값이 true일 경우 period 배열의 마지막 값으로 계속해서 재시도합니다.
    * 재시도 하는 도중 초기화가 성공할 경우 재시도를 멈춥니다.
    * retry 값이 false인데 period가 빈 배열일 경우 첫시도 후 실패시 재시도하지 않고 끝납니다.
    * retry 값이 true인데 period가 빈 배열일 경우 위에서 설명한 기본 값으로 재시도합니다.
=== "Kotlin"
    ```kotlin
    crashipConfig.setInitializeRule(false, intArrayOf(5, 30, 60, 600))
    ```
=== "Java"
    ```java
    int[] rules = {5, 30, 60, 600};
    crashipConfig.setInitializeRule(false, rules);
    ```

#### Callback 설정
* CrashipCallback을 생성해 초기화에 대한 성공, 실패 여부에 대한 응답을 받습니다.
    * 해당 객체는 선택사항입니다.
=== "Kotlin"
    ```kotlin
    val crashipCallback = object : CrashipCallback {
        override fun onFail(error: CrashipError, msg: String) {
            // 에러 처리
        }
        override fun onSuccess() {
            // 성공 처리
        }
    }
    ```
=== "Java"
    ```java
    CrashipCallback crashipCallback = new CrashipCallback() {
        @Override
        Public void onFail(@NonNull CrashipError error, @NonNull String msg) {
            Log.d(“craship”, error.name() + “ : ” + msg);
        }

        @Override
        Public void onSuccess() {
            Log.d(“craship”, “SUCCESS”);
        }
    };
    ```
#### Craship 생성
* Craship 객체에 위에서 생성한 설정 정보를 가지고 있는 CrashipConfig와 Callback 객체인 CrashipCallback을 설정해주세요.
* install api를 호출하면 초기 설정이 완료됩니다.
=== "Kotlin"
    ```kotlin
    val craship = Craship()
    craship.install(crashipConfig, crashipCallback)
    ```
=== "Java"
    ```java
    Craship craship = new Craship();
    craship.install(crashipConfig, crashipCallback);
    ```

## Log 설정하기
AppCatch를 통해 클라이언트의 로그 정보를 수집하기 위한 설정 방법에 대해 설명합니다.

#### Callback 설정
* CrashipLoggerCallback을 생성해 로그 정보 저장 혹은 전송에 대한 성공, 실패 여부에 대한 응답을 받습니다.
=== "Kotlin"
    ```kotlin
    val loggerCallback = object: CrashipLoggerCallback {
        override fun onFail(error: CrashipError, msg: String) {
            // 에러 처리
        }
        override fun onSuccess() {
            // 성공 처리
        }
    }
    CrashipLogger.setCallback(loggerCallback)
    ```
=== "Java"
    ```java
    CrashipLoggerCallback logCallback = new CrashipLoggerCallback() {
        @Override
        public void onFail(@NonNull CrashipError error, @NonNull String msg) {
            Log.d(“craship-log”, error.name() + “ : “ + msg);
        }

        @Override
        public void onSuccess() {
            Log.d(“craship-log”, “SUCCESS”);
        }
    }

    CrashipLogger.Companion.setCallback(logCallback);
    ```
#### Database에 로그 저장
* 각 로그 정보가 해당하는 레벨에 알맞은 api를 호출해주세요.
    * AppCatch에서는 info/debug/warn/error/fatal 레벨을 제공하고 있습니다.
=== "Kotlin"
    ```kotlin
    CrashipLogger.info("message")
    CrashipLogger.debug("message")
    CrashipLogger.warn("message")
    CrashipLogger.error("message")
    ```
=== "Java"
    ```java
    CrashipLogger.lg.info("message");
    CrashipLogger.lg.debug("message");
    CrashipLogger.lg.warn("message");
    CrashipLogger.lg.error("message");
    ```
#### 서버로 로그 전송
* 여태까지 저장한 로그를 CrashipLogger$fatal 혹은 CrashipLogger$ship api를 호출하면 모두 전송하게 됩니다.
=== "Kotlin"
    ```kotlin
    CrashipLogger.fatal("message")
    CrashipLogger.ship()
    ```
=== "Java"
    ```java
    CrashipLogger.lg.fatal("message");
    CrashipLogger.lg.ship();
    ```