/*
 * ─────────────────────────────────────────────────────────────
 *  설정 파일 — 사이트를 바꾸려면 거의 이 파일만 고치면 된다.
 * ─────────────────────────────────────────────────────────────
 *
 *  id    : 폴더 이름 = 시트 탭 이름 = 라우팅 키. 셋 다 반드시 같은 문자열.
 *          영문/숫자/-/_ 만 사용 (예: '01-jaeyeon')
 *  name  : 버튼에 보이는 이름
 *  doc   : iframe에 처음 띄울 주소 (구글 독스/슬라이드). 비워두면 EVERYONE의 공용 문서가 뜬다.
 *  drive : '드라이브' 링크 주소 (embeddedfolderview 형식 권장). 비워두면 EVERYONE의 공용 폴더가 뜬다.
 *
 *  URL 형식은 README.md 의 "구글 문서 주소 만들기" 참고.
 */
window.CONFIG = {
  SITE_TITLE: '다들 뭐하고 있나요?',

  // Apps Script 웹앱 배포 후 나오는 .../exec 주소. 비워두면 방명록이 저장되지 않는 미리보기 모드.
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzcDYes5m7O7WqQZP3uXBg_gWv0b1DdEokD0xUeM44Yex8W9x8wLw0OGmScTdvyJ3AnDw/exec',

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
    drive: 'https://drive.google.com/embeddedfolderview?id=1640a3SK2K5l1ND-B1mipTiOI51HTlvLs#grid',
  },

  // 학생 목록 — 폴더를 복사해서 추가했다면 여기에도 한 줄 추가
  STUDENTS: [
    { id: '01-student1',  name: '동준', doc: 'https://docs.google.com/document/d/1cIDii0ybSPqPG7IFR9XsfvGd4wbIti6RMpSOXRr1wZI/edit?usp=sharing', drive: '' },
    { id: '02-student2',  name: '예영', doc: 'https://docs.google.com/document/d/1IWNw3fdEmaLjb32XNQTYHtB03CoSnBzf4cu3HOS4YPE/edit?usp=sharing', drive: '' },
    { id: '03-student3',  name: '수영', doc: 'https://docs.google.com/document/d/1qaHAZxjm9rNKkYIp8TsF02xqrXxd3stXT5oCxcb44j4/edit?usp=sharing', drive: '' },
    { id: '04-student4',  name: '해린', doc: 'https://docs.google.com/document/d/1x_YdTnLrsUu6QWSD7BypRX-t3Xv3Byd4NCCUb0i2cwA/edit?usp=sharing', drive: '' },
    { id: '05-student5',  name: '여지', doc: 'https://docs.google.com/document/d/1GUdk0xgM-_mpiyMqqmc8pNp1Op2z36GB0orhyAJSazY/edit?usp=sharing', drive: '' },
    { id: '06-student6',  name: '진규', doc: 'https://docs.google.com/document/d/1pT74pV_-l0kZiApePpLYEzu8WttXSW9AkfcDqgiFaks/edit?tab=t.0#heading=h.6mnhacqsgo6r', drive: '' },
    { id: '07-student7',  name: '영서', doc: 'https://docs.google.com/document/d/1MZFCPiaBPLP-hYT_pfn4FhVrh-8FrjlTRvFMdva8lSQ/edit?usp=drivesdk', drive: '' },
    { id: '08-student8',  name: '연준', doc: 'https://docs.google.com/document/d/1Ah9P9NAmrQ8fyZ4MHi_BVDJsgTf49kMKm77f-O5n1G0/edit?tab=t.0', drive: '' },
    { id: '09-student9',  name: '윤선Y', doc: 'https://docs.google.com/document/d/1O7rl4GrK3nZMNhDAtJqo7wsUNLhBxdBdHVsOV704Am0/edit?usp=sharing', drive: '' },
    { id: '10-student10', name: '수민J', doc: 'https://docs.google.com/document/d/1pbQpXC-0YsQApZuH0Jvyxo36Su3O7EobuESptepHXPU/edit?usp=sharing', drive: '' },
    { id: '11-student11', name: '경민', doc: 'https://docs.google.com/document/d/1AUtNbjp2eX3B3ZXw6Tjg1-TmJ5C7VryW7z7I8jXilpY/edit?usp=sharing', drive: '' },
    { id: '12-student12', name: '정민', doc: 'https://docs.google.com/document/d/1Duf_B2cVyOQ8-e8t66YO89HGxbqhyfvT7Y7iPqtaxSo/edit?usp=sharing', drive: '' },
    { id: '13-student13', name: '수민H', doc: 'https://docs.google.com/document/d/1LW6Na1V-UqrjHOWfq3ecrrcqtziWSifvDg9yoyj0Apw/edit?usp=sharing', drive: '' },
    { id: '14-student14', name: '유진', doc: '', drive: '' },
    { id: '15-student15', name: '은영', doc: 'https://docs.google.com/document/d/1q2KY-CGKX7-xVIUY8uoog0dMrg5USjhVYcXkS5rbfi0/edit?usp=sharing', drive: '' },
    { id: '16-student16', name: '건호', doc: 'https://docs.google.com/document/d/1VmAKZzfsCGJw47IgzXNp5baYf0rjs8E3TtqPpN0GvLE/edit?usp=sharing', drive: '' },
    { id: '17-student17', name: '윤선H', doc: '', drive: '' },
    { id: '18-student18', name: '호웨이', doc: '', drive: '' },
    { id: '19-student19', name: '한핑', doc: '', drive: '' },
    { id: '20-student20', name: '한한', doc: '', drive: '' },
    { id: '21-student21', name: '쳰시', doc: '', drive: '' },
    { id: '22-student22', name: '퀸유', doc: '', drive: '' },
    { id: '23-student23', name: '려원', doc: 'https://docs.google.com/document/d/13WZKuDUF5_EEd2VTqzyQ1sgwjg_Gp_vinrUQJOIoR1g/edit?usp=sharing', drive: '' },
    { id: '24-student24', name: '예지', doc: 'https://docs.google.com/document/d/10NTN8WS4iyywImmR0MWaAUOTlgWC_vza18INHGXeFM0/edit?usp=sharing', drive: '' },
    { id: '25-student25', name: '호연', doc: 'https://docs.google.com/document/d/1ZVcTfc0LgwSZfF2MqYaZIZJeaX1aOp8nRMXPosYBj3w/edit?usp=sharing', drive: '' },
    { id: '26-student26', name: '민서', doc: 'https://docs.google.com/document/d/1VnbITgmPc7urEgCYEc7ZaJ5kwxsFU9licsv6rjot86I/edit?usp=sharing', drive: '' },
    { id: '27-student27', name: '병학', doc: 'https://docs.google.com/document/d/1QVvbr1GV3RBYY70vUlo9_eEQnO6oxmqOu09-2W-V4os/edit?usp=drive_link', drive: '' },
  ],
};
