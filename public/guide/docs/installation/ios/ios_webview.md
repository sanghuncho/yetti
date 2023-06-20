# WebView에 AppCatch 설정하기
WebView를 사용하고 있는 개발 환경을 위한 AppCatch 설정 방법에 대해 설명합니다.

## WebView 초기 설정

WKWebView를 사용하고 있는 개발 환경이라면 Delegate Setting을 하여 WebView에 대한 설정을 추가해주세요.
=== "Swift"
    ```Swift
    import WebKit
    class WebViewController: UIViewController,
                             WKNavigationDelegate,
                            WKUIDelegate,WKScriptMessageHandler {...
    ```
=== "Objective-C"
    ```Objective-C
    #import <WebKit/WebKit.h>#import “프로젝트이름-Swift.h”
    @interface WebViewController: UIViewController<WKUIDelegate,
                                                    WKNavigationDelegate,
                                                    WKScriptMessageHandler...
    ```

WKWebView에 script Handler를 등록 합니다.
=== "Swift"
    ```Swift
    let config = WKWebViewConfiguration()
    config.userContentController.add(self,name: "craship")
    ```
=== "Objective-C"
    ```Objective-C
    [self.wkWebView.configuration.userContentController addScriptMessageHandler:self 
                                                                           name: @"craship"];
    ```

error callback을 셋팅 합니다.
=== "Swift"
    ```Swift
    let webViewCrashCallback = {(error : Error?, msg : String)-> () in
        print("error \(error.debugDescription)")
        print("msg \(msg)")
    }
    ```
=== "Objective-C"
    ```Objective-C
    id logCallback = ^(NSError * _Nullable error,NSString * _Nonnull message){
        NSLog(@"check error %@",error)
        NSLog(@"check error code %d",error.code);
        NSLog(@"check message %@",message);
        NSLog(@”check error description %@”,error.description);
    };
    ```

JS <-> Webview Delegate 함수에 API를 실행시킵니다.
=== "Swift"
    ```Swift
     func userContentController(_ userContentController:WKUserContentController,
                                     didReceive message: WKScriptMessage) {
        If let webViewReportDict : Dictionary<String,Any> = message.body as? Dictionary<String,Any>{
              CrashipWebView.sendWebViewData(webViewCrashInfo: message, 
                                                   completion: webViewCrashCallback)        
        }
    }
    ```
=== "Objective-C"
    ```Objective-C
    - (void)userContentController:(WKUserContentController *)userContentController 
          didReceiveScriptMessage:(WKScriptMessage *)message{
        NSDictionary *webViewDict = (NSDictionary *)message.body;
        [CrashipWebViewSwiftClass sendWebViewDataWithWebViewCrashInfo:webViewDict completion:logCallback];
    }
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