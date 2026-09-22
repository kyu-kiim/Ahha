# 다들 뭐하고 있나요?

졸업전시 준비 기간 동안 같은 반 사람들이 각자 뭘 하고 있는지 볼 수 있는 공유 작업판.
정적 HTML + Google Docs iframe + Google Sheets 방명록. 빌드, 서버, 로그인, npm 없음.

```
index.html              홈
00-everyone/index.html  반 전체 문서
01-student1/ … 26-student26/   학생 페이지 (전부 같은 파일, data-page만 다름)
config.js               ← 이름, 문서 주소, D-day, SCRIPT_URL — 거의 여기만 고치면 됨
script.js / style.css   모든 페이지 공용
apps-script/Code.gs     방명록 백엔드 (구글 시트에 붙여넣기)
new-page.sh             학생 페이지 폴더 추가 도우미
```

**폴더 이름 = 시트 탭 이름 = config.js의 id.** 셋은 반드시 같은 문자열이어야 한다.

---

## 1. 방명록 백엔드 (15분)

1. 새 구글 스프레드시트 생성
2. 확장 프로그램 → Apps Script → `apps-script/Code.gs` 내용을 통째로 붙여넣기
3. `SHEET_NAMES`를 config.js의 id 목록과 똑같이 맞추기
4. 위쪽 함수 목록에서 `setupSheets` 선택 → 실행 → 권한 허용
   → 탭과 `timestamp | message` 헤더가 자동으로 생긴다
5. 배포 → 새 배포 → 유형: **웹 앱** / 실행: **나** / 액세스: **모든 사용자** → 배포
6. 나온 `https://script.google.com/macros/s/…/exec` 주소를 `config.js`의 `SCRIPT_URL`에 넣기

> Code.gs를 고친 다음엔 **배포 관리 → 연필 → 버전: 새 버전 → 배포**를 해야 반영된다.
> URL은 그대로 유지된다. ("새 배포"를 누르면 URL이 바뀌니 주의)

확인: 브라우저에서 `…/exec?sheet=home` 을 열어서 `[]` 가 나오면 성공.

## 2. 구글 문서 주소 만들기

각 문서의 공유 설정을 **링크가 있는 모든 사용자**로 해둔 뒤:

| 무엇 | config.js에 넣을 주소 | 비고 |
|---|---|---|
| 독스 (편집 가능) | `https://docs.google.com/document/d/문서ID/edit` | 보는 사람이 구글에 로그인돼 있어야 함 |
| 독스 (읽기 전용) | 파일 → 공유 → 웹에 게시 → `…/pub?embedded=true` | 로그인 없이 보임 |
| 슬라이드 | 파일 → 공유 → 웹에 게시 → 퍼가기의 src + `&rm=minimal` | `rm=minimal`이 구글 UI를 지움 |
| 드라이브 폴더 | `https://drive.google.com/embeddedfolderview?id=폴더ID#grid` | 일반 폴더 주소는 iframe에 안 뜸 |

주소를 비워두면 "아직 문서가 연결되지 않았어요" 안내 화면이 뜬다.

## 3. config.js 채우기

```js
SCRIPT_URL: 'https://script.google.com/macros/s/…/exec',
EXHIBITION: { label: '졸업전시', date: '2026-12-07T00:00:00+09:00' },  // 전시 오픈일
STUDENTS: [
  { id: '01-jaeyeon', name: '재연', doc: 'https://docs.google.com/…', drive: 'https://drive.google.com/embeddedfolderview?id=…#grid' },
  …
],
```

## 4. 학생 이름 바꾸기 / 추가하기

임시 이름(`01-student1` 등)을 실제 이름으로 바꿀 때는 세 곳을 같이 바꾼다:

1. 폴더 이름 (`01-student1` → `01-jaeyeon`)
2. 그 폴더 `index.html`의 `data-page="01-student1"` → `data-page="01-jaeyeon"`
3. `config.js`의 id, `Code.gs`의 `SHEET_NAMES` (→ 새 버전 배포, `setupSheets` 다시 실행)

새로 추가할 때는 `./new-page.sh 18-name` 으로 폴더를 만들고 위 3번만 하면 된다.
(스크립트 없이 아무 학생 폴더나 복사해서 `data-page`만 바꿔도 똑같다)

## 5. 로컬에서 보기

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 6. 배포 (Vercel)

```bash
git init && git add -A && git commit -m "init"
gh repo create my-class-board --public --source=. --push
```

vercel.com → Add New Project → 저장소 임포트 → Framework: **Other**, 빌드 설정 전부 비움 → Deploy.
이후 `git push` 할 때마다 자동 배포. 도메인은 Project → Settings → Domains.

---

## 기능 메모

- **이름 버튼**: 그냥 페이지 이동 링크.
- **안녕( ) / 드라이브**: `<a target="board">` — 페이지 이동 없이 iframe만 바뀐다. ↗는 새 탭에서 열기.
- **타이머**: 평소엔 D-day. `T` 버튼(또는 키보드 T)으로 발표 타이머 전환 → 분 선택 → 시작.
  마지막 1분은 주황색, 끝나면 화면 전체가 빨간색.
- **방명록**: 페이지마다 따로. 익명, 최대 500자, ⌘/Ctrl+Enter로 전송. 60초마다 자동 새로고침.
  POST는 `no-cors`로 보내고(응답을 못 읽음) 1.2초 뒤 목록을 다시 불러와서 확인한다.
- **관리**: 부적절한 댓글은 스프레드시트에서 행을 지우면 끝.
- **보안**: 댓글은 textContent로 그려서 HTML이 주입되지 않는다. 서버는 목록에 없는 탭 이름을 거부하고,
  `=`로 시작하는 글은 수식으로 해석되지 않게 저장한다. 시간은 서버 시간으로 기록한다.
