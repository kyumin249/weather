1. 날씨 예보 사이트(https://weather-sooty-two.vercel.app/)

2.1. 본 프로젝트는 리액트의 공부방식을 바꾸고 만들면서 공부하는 방식을 정착시키는 것을 목표로 한다.

2.2 날씨 정보를 알려주는 웹 사이트로 사용자가 도시의 날씨 확인,날짜별 날씨 알려주는 기능

2.3. 우리 동네 날씨 정보 확인, 원하는 도시 선정 기능, 날짜별로 7일 날씨 확인 기능

3. 프로그램 전체 폴더,파일 구조

3-2. 컴포넌트: header, main

<!-- 3.3 라우팅 구조: <BrowserRouter>
      <Header />
      {/* Main은 순수 레이아웃(children을 감싸는 컨테이너) 역할만 수행합니다 */}
      <Main>
        <Routes>
          {/* 각 페이지 컴포넌트에 도시 상태와 변경 함수를 바인딩합니다 */}
          <Route 
            path="/" 
            element={<Home currentCity={currentCity} />} 
          />
          <Route 
            path="/cities" 
            element={<Cities currentCity={currentCity} setCurrentCity={setCurrentCity} />} 
          />
          <Route 
            path="/week" 
            element={<Week currentCity={currentCity} />} 
          />
        </Routes>
      </Main>
    </BrowserRouter> -->

    4. 디자인 구성

    5. 결론 및 고찰