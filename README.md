## 1. 개요
### 1.1 OpenPlanet 이란?
- OpenSea를 모티브로 한 NFT 거래소
- 창작자가 직접 NFT를 제작 / 판매 할 수 있는 사이트

## 2. 사이트 이용 매뉴얼
### 2.1 메인넷 설정
#### 1) 크롬 > 확장 프로그램 > 메타마스크 설치
#### 2) 메타마스크 네트워크 추가
- 네트워크 이름 : Planet Mainnet (임의로 수정 가능)
- 새 RPC URL : https://pr.yjsworld.tk
- 체인 ID : 1337
- 통화 기호 : ETH

![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/1-메인넷설정.png?raw=true)

### 2.2 계정 가져오기
#### 1) 메타마스크 오른쪽 상단 이미지 클릭
#### 2) 계정 가져오기 클릭
#### 3) 비공개 키 유형 선택
#### 4) 비공개 키 입력 및 저장
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/2-계정가져오기.png?raw=true)

### 2.3 로그인
#### 1) 사이트 접속
- 사이트 로그인 URL : https://nft-marketplace-nextjs-jungsikyeo.vercel.app/login

#### 2) 메타마스크 계정으로 로그인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/3-로그인.png?raw=true)

#### 3) 메타마스크 계정 연결
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/4-메타마스크연결.png?raw=true)

### 2.4 메인 홈
#### 1) 최근 판매중인 아이템 확인
#### 2) 상단 검색 바 기능 미구현
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/5-메인홈.png?raw=true)

### 2.5 우측 사이드 바
#### 1) 오른쪽 상단 지갑 아이콘 클릭
#### 2) 계정의 잔고 및 메뉴 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/6-우측사이드바.png?raw=true)

### 2.6 컬렉션 탐색
#### 1) 상단 Explore 아이콘 클릭
#### 2) 거래소에 생성된 컬렉션 목록 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/7-컬렉션탐색.png?raw=true)

### 2.7 컬렉션 상세
#### 1) 컬렉션의 정보 확인
#### 2) 컬렉션의 아이템(NFT) 목록 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/8-컬렉션상세.png?raw=true)


### 2.8 아이템 상세
#### 1) 아이템의 정보 확인
#### 2) 현재 판매 가격 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/9-아이템상세.png?raw=true)

### 2.9 아이템 전송
#### 1) 다른 계정 지갑 주소 입력
#### 2) Transfer 버튼 클릭
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/10-아이템전송.png?raw=true)

### 2.10 아이템 전송 완료
#### 1) 아이템이 다른 계정으로 전송되면 해당 계정으로 소유주가 바뀜
#### 2) 아이템을 전송한 계정은 현 소유주가 아니므로 Buy now 버튼으로 구매 가능
#### 3) Make offer 기능 미구현
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/11-아이템전송완료.png?raw=true)

### 2.11 아이템 수신 완료
#### 1) 2.10에서 전송받은 계정 지갑으로 로그인
#### 2) 상단 마이페이지 아이콘 클릭
#### 3) 내 아이템으로 수신 확인 
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/12-아이템수신완료(마이페이지-아이템).png?raw=true)

### 2.12 판매 가격 변경
#### 1) 판매할 아이템 목록 클릭
#### 2) Lower price 버튼 클릭
#### 3) Price에 변경 가격 입력 후 Complete listing 버튼 클릭
#### 4) Auction 기능은 미구현
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/13-판매가격변경.png?raw=true)

### 2.13 판매 가격 변경 완료
#### 1) 판매 아이템의 변경된 가격 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/14-판매가격변경완료.png?raw=true)

### 2.14 컬렉션 생성
#### 1) 상단 Create 버튼 클릭
#### 2) New Collection 버튼 클릭
#### 3) 정보 입력 후 Create 버튼 클릭
- Name, URL, Description 은 190자 글자 제한 (향후 수정 가능)
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/15-컬렉션생성.png?raw=true)

### 2.15 컬렉션 생성 완료
#### 1) 마이페이지의 내 컬렉션 목록에서 생성된 컬렉션 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/16-컬렉션생성완료(마이페이지-컬렉션).png?raw=true)

### 2.16 아이템 생성
#### 1) 상단 Create 버튼 클릭
#### 2) New Item 버튼 클릭
#### 3) 정보 입력 후 Create 버튼 클릭
- Name, External link, Description 은 190자 글자 제한 (향후 수정 가능)

![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/17-아이템생성.png?raw=true)

#### 4) 마켓 등록 비용 지불
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/18-마켓등록비용지불.png?raw=true)

### 2.17 아이템 생성 완료
#### 1) 마이페이지의 내 아이템 목록에서 생성된 아이템 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/19-아이템생성완료.png?raw=true)

### 2.18 아이템 판매
#### 1) 판매할 아이템 목록 클릭
#### 2) Sell 버튼 클릭
#### 3) Price에 판매 가격 입력 후 Complete listing 버튼 클릭
#### 4) Auction 기능은 미구현
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/20-아이템판매등록.png?raw=true)

### 2.19 아이템 판매 등록 완료
#### 1) 판매 아이템의 가격 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/21-아이템판매등록완료.png?raw=true)

### 2.20 최근 판매 아이템 목록
#### 1) 최근 판매중인 아이템 확인
![img](https://github.com/jungsikyeo/nft-marketplace-nextjs/blob/master/public/screenshot/22-최근판매아이템목록.png?raw=true)