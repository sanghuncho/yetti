# WebView에 AppCatch 설정하기
WebView를 사용하고 있는 개발 환경을 위한 AppCatch 설정 방법에 대해 설명합니다.

## WebView 초기 설정
WebView를 사용하고 있는 개발 환경이라면 Craship$addWebViewSetting api를 통해 WebView에 대한 설정을 추가해주세요.
=== "Kotlin"
    ```kotlin
    val webview: WebView = findVeiwById(R.id.webview)
    val callback = obj: CrashipCallback {
        override fun onFail(error: CrashipError, msg: String) {
            // 에러처리
        }
        override fun onSuccess() {
            // 성공처리
        }
    }

    Craship.addWebViewSetting(webview, callback)
    ```
=== "Java"
    ```java
    WebView webview = findViewById<WebView>(R.id.webview)

    CrashipCallback callback = new CrashipCallback() {
        @Override
        public void onFail(@NonNull CrashipError error, @NonNull String msg) {
            // 에러 처리
        }

        @Override
        public void onSuccess() {
            // 성공 처리
        }
    };

    Craship.Companion.addWebViewSetting(webview, callback);
    ```
## Crash 설정하기
WebView에서 발생하는 Crash정보를 수집하기 위한 AppCatch 설정 방법에 대해 설명합니다.

### WebView 적용 방법
아래 코드를 js 영역에 추가해주세요. </br>
AppCatch를 통해 WebView에서 발생하는 Crash 정보도 수집할 수 있습니다.
=== "JavaScript"
    ```js
    window.onerror = (msg, url, line, column, error) => {
    const errorMessage = {
        msg: msg,
	    name : error.name,
	    message : error.message,
        url: url,
        line: line,
        column: column,
	    stack : error.stack
    }

    if (typeof window.webkit != 'undefined') {
	    if (window.webkit.messageHandlers && window.webkit.messageHandlers.craship) {
		    window.webkit.messageHandlers.craship.postMessage(errorMessage);
	    }
    } else {
	    if (window.craship) {
		    craship.pushCrashInfo(JSON.stringify(errorMessage))
	    }
    }
    }
    ```

## Log 설정하기
WebView에서 클라이언트의 로그 정보를 수집하기 위한 AppCatch 설정 방법에 대해 설명합니다.

### WebView 적용 방법
아래 코드를 js 영역에 추가해주세요. </br>
AppCatch를 통해 WebView에서도 클라이언트의 로그 정보를 수집할 수 있습니다.
=== "JavaScript"
    ```js
    function crashipLog(level,msg) {
	    if(level === 'debug' || level === 'info' || level === 'warn' ||  level === 'error' || level === 'fatal'){
	        if (typeof window.webkit != 'undefined') {
		        if (window.webkit.messageHandlers && window.webkit.messageHandlers.craship) {
			        window.webkit.messageHandlers.craship.postMessage({"level":level,msg:msg});
		        }
		    } else {
		        if (window.craship) {
			        craship.pushLogInfo(level,msg)
		        }
	        }
	    }
    }
    ```