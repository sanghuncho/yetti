# AppCatch - Android 설치 및 설정

## Android SDK 설치 및 설정 방법
모바일 앱에서 발생하는 크래시 정보와 클라이언트의 로그 정보를 수집하여 정확한 분석이 가능하도록 합니다. <br/>
클라이언트의 로그 기록을 통해 클라이언트에서 어떤 로직으로 앱이 동작하는지 확인할 수 있습니다. <br/>
사용자 행동 로직과 크래시 정보를 통해 보다 빠르고 정확하게 개선을 할 수 있으며, <br/>
보다 안전한 앱을 운영하실 수 있도록 도와주는 서비스입니다. <br/>

## 지원환경
Appcatch는 다음과 같은 환경에서 원활하게 사용하실 수 있습니다.

##### 지원환경
* Android 4.4 이상
* Android Studio 최신 버전

##### 개발환경
* Android Studio Chipmunk 2021.2.1 Patch 1

## SDK 설치
안드로이드 SDK 설치 방법에 대해 설명합니다.

### 라이브러리 설정
AppCatch 라이브러리를 추가할 libs 폴더를 <project_dir\>/app/ 위치에 생성해주세요. <br/>
이미 libs 폴더가 있을 경우 해당 과정을 생략하여도 됩니다. <br/>
해당 libs 폴더에 대한 설정을 <project_dir\>/app/build.gradle에 추가해주세요. <br/>
```
repositories {
	flatDir {
		dirs ‘libs’
	}
}
```

libs 폴더에대한 설정을 추가하였으면 dependency에 라이브러리 정보를 추가합니다. <br/>
<project_dir\>/app/build.gradle에 추가해주세요. <br/>
```
dependencies {
	api ‘:crasihp-release_버전정보@aar’
}
```

### 라이브러리 환경 설정
#### Permission 설정
AndroidManifest.xml에 인터넷에 대한 permission과 위치 정보에 대한 permission을 추가해주세요. <br/>
위치 정보에 대한 permission은 선택 사항이므로, 원하지 않을 경우 추가하지 않아도 됩니다. <br/>
```
// 필수
<uses-permission android:name=”android.permission.INTERNET”/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
// 선택
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

#### Provider 설정
AndroidManifext.xml에 provider에 대한 설정도 추가해주세요.

* android:name 은 "com.yettiesoft.craship.storage.CrashipProvider" 로 설정해주세요.
* android:authorities 는 다른 앱들과 겹치지 않게 **고유한 값**으로 설정해주세요.
* android:exported 는 다른 앱에서 접근할 수 없도록 false 로 설정해주세요.
```
<application>
    // name 은 아래 값으로 고정, authorities 는 다른 앱들과 겹치지 않게 고유한 값으로 설정
    <provider
        android:authorities="고유한 값"
        android:name="com.yettiesoft.craship.storage.CrashipProvider"
        android:exported="false"/>
</application>
```

#### Kotlin 설정
만약 개발 환경이 kotlin이 아니거나 kotlin 에 대한 dependency가 없을 경우 추가해주세요.

* build.gradle(project 수준)에 dependency를 추가해주세요.
```
buildscript {
    ...
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:$버전정보'
    }
}
```

* build.gradle(app 수준)에 plugin을 추가해주세요.
```
apply plugin: 'org.jetbrains.kotlin.android'
```

* build.gradle(app 수준)에 dependency를 추가해주세요.
```
dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:$버전정보'
}
```

#### Proguard 구성
Proguard와 함께 앱에서 AppCatch를 사용하는 경우 난독화 후 모델 객체가 직렬화 및 역직렬화되는 방식을 고려해야 합니다.<br/>
아래와 같이 proguard-rules.pro에 규칙을 추가해주세요.
```
# global rule을 추가해주세요.
-keepattributes Signature

# com.company.model 패키지 아래에 있는 클래스들에 대한 Proguard rule입니다.
# 앱의 구조에 맞게 규칙을 수정해주세요.
-keepclassmembers class com.company.model.** {
    *;
}
```