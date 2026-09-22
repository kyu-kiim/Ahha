/*
 * ─────────────────────────────────────────────────────────────
 *  설정 파일 — 사이트를 바꾸려면 거의 이 파일만 고치면 된다.
 * ─────────────────────────────────────────────────────────────
 *
 *  id    : 폴더 이름 = 시트 탭 이름 = 라우팅 키. 셋 다 반드시 같은 문자열.
 *          영문/숫자/-/_ 만 사용 (예: '01-jaeyeon')
 *  name  : 버튼에 보이는 이름
 *  doc   : iframe에 처음 띄울 주소 (구글 독스/슬라이드). 비워두면 안내 화면.
 *  drive : '드라이브' 링크 주소 (embeddedfolderview 형식 권장). 비워두면 안내 화면.
 *
 *  URL 형식은 README.md 의 "구글 문서 주소 만들기" 참고.
 */
window.CONFIG = {
  SITE_TITLE: 'AH / HA',

  // Apps Script 웹앱 배포 후 나오는 .../exec 주소. 비워두면 방명록이 저장되지 않는 미리보기 모드.
  SCRIPT_URL: '',

  // D-day 기준. 날짜가 정해지면 여기만 바꾸면 된다. (+09:00 = 한국 시간)
  EXHIBITION: {
    label: '졸업전시',
    date: '2026-12-07T00:00:00+09:00',
  },

  // 발표 타이머 프리셋 (분)
  TALK_PRESETS: [3, 5, 7, 10, 15],

  // 홈 (index.html)
  HOME: {
    name: '홈',
    doc: '',
    drive: '',
  },

  // 반 전체 문서 (00-everyone/)
  EVERYONE: {
    id: '00-everyone',
    name: '아하',
    doc: 'https://docs.google.com/document/d/1J3M0U3kWj2a255Urhqf3xC5aWTmV3ptJKXRma0axibI/edit?tab=t.0',
    drive: '',
  },

  // 학생 목록 — 폴더를 복사해서 추가했다면 여기에도 한 줄 추가
  STUDENTS: [
    { id: '01-student1',  name: '동준',  doc: '', drive: '' },
    { id: '02-student2',  name: '예영',  doc: '', drive: '' },
    { id: '03-student3',  name: '수영',  doc: '', drive: '' },
    { id: '04-student4',  name: '해린',  doc: '', drive: '' },
    { id: '05-student5',  name: '여지',  doc: '', drive: '' },
    { id: '06-student6',  name: '진규',  doc: '', drive: '' },
    { id: '07-student7',  name: '영서',  doc: '', drive: '' },
    { id: '08-student8',  name: '연준',  doc: '', drive: '' },
    { id: '09-student9',  name: '윤선',  doc: '', drive: '' },
    { id: '10-student10', name: '수민J', doc: '', drive: '' },
    { id: '11-student11', name: '경민', doc: '', drive: '' },
    { id: '12-student12', name: '정민', doc: '', drive: '' },
    { id: '13-student13', name: '수민H', doc: '', drive: '' },
    { id: '14-student14', name: '유진', doc: '', drive: '' },
    { id: '15-student15', name: '은영', doc: '', drive: '' },
    { id: '16-student16', name: '건호', doc: '', drive: '' },
    { id: '17-student17', name: '윤선', doc: '', drive: '' },
    { id: '18-student18', name: '호웨이', doc: '', drive: '' },
    { id: '19-student19', name: '한핑', doc: '', drive: '' },
    { id: '20-student20', name: '한한', doc: '', drive: '' },
    { id: '21-student21', name: '쳰시', doc: '', drive: '' },
    { id: '22-student22', name: '퀸유', doc: '', drive: '' },
    { id: '23-student23', name: '려원', doc: '', drive: '' },
    { id: '24-student24', name: '예지', doc: '', drive: '' },
    { id: '25-student25', name: '호연', doc: '', drive: '' },
    { id: '26-student26', name: '민서', doc: '', drive: '' },
  ],
};
