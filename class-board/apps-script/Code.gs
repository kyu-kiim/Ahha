/**
 * 방명록 백엔드 — Google Sheets 에 붙은 Apps Script 웹앱.
 *
 *  GET  .../exec?sheet=01-student1        → [{ timestamp, message }, ...]
 *  POST .../exec  body: {"sheet":"01-student1","message":"..."}
 *
 *  시트 탭 1개 = 페이지 1개 = 방명록 1개. 탭 이름 = 사이트의 폴더 이름.
 *
 *  설치:
 *   1) 스프레드시트 → 확장 프로그램 → Apps Script → 이 파일 내용 붙여넣기
 *   2) 아래 SHEET_NAMES 를 config.js 의 id 들과 똑같이 맞추기
 *   3) 상단 함수 선택에서 setupSheets 선택 → 실행 (권한 허용) → 탭이 자동 생성됨
 *   4) 배포 → 새 배포 → 웹 앱 / 실행: 나 / 액세스: 모든 사용자 → /exec URL 복사
 *   ※ 코드를 고치면 "배포 관리 → 수정(연필) → 버전: 새 버전" 으로 다시 배포해야 반영된다.
 */

// 비워두면 이 스크립트가 붙어 있는 스프레드시트를 쓴다. 다른 시트를 쓰려면 ID 입력.
const SHEET_ID = '';

// 사이트의 페이지 id 목록 (config.js 와 동일하게)
const SHEET_NAMES = [
  'home',
  '00-everyone',
  '01-student1', '02-student2', '03-student3', '04-student4', '05-student5',
  '06-student6', '07-student7', '08-student8', '09-student9', '10-student10',
  '11-student11', '12-student12', '13-student13', '14-student14', '15-student15',
  '16-student16', '17-student17',
];

const MAX_LEN = 500;   // 댓글 최대 글자 수
const MAX_ROWS = 300;  // GET 에서 돌려줄 최근 댓글 수
const NAME_RE = /^[A-Za-z0-9_-]{1,40}$/;

function ss_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function toIso_(v) {
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

/** 읽기 */
function doGet(e) {
  const name = String((e && e.parameter && e.parameter.sheet) || 'home');
  if (!NAME_RE.test(name)) return json_([]);

  const sheet = ss_().getSheetByName(name);
  if (!sheet) return json_([]);

  const last = sheet.getLastRow();
  if (last < 2) return json_([]);

  const start = Math.max(2, last - MAX_ROWS + 1);
  const rows = sheet.getRange(start, 1, last - start + 1, 2).getValues();
  const data = rows
    .filter(function (r) { return r[1] !== '' && r[1] !== null; })
    .map(function (r) { return { timestamp: toIso_(r[0]), message: String(r[1]) }; });

  return json_(data);
}

/** 쓰기 */
function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad json' });
  }

  const name = String(body.sheet || '');
  let message = String(body.message || '').trim().slice(0, MAX_LEN);
  if (!NAME_RE.test(name) || !message) return json_({ ok: false, error: 'invalid' });

  // = + - @ 로 시작하면 시트가 수식으로 해석하므로 앞에 ' 를 붙여 글자로 저장
  if (/^[=+\-@]/.test(message)) message = "'" + message;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 목록에 없는 탭은 만들지 않는다 (아무나 탭을 무한 생성하는 것 방지)
    const sheet = ss_().getSheetByName(name);
    if (!sheet) return json_({ ok: false, error: 'unknown sheet' });
    // 시간은 클라이언트가 보낸 값 대신 서버 시간으로 기록
    sheet.appendRow([new Date(), message]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

/** 최초 1회 실행: SHEET_NAMES 대로 탭과 헤더를 만든다. 여러 번 실행해도 안전. */
function setupSheets() {
  const ss = ss_();
  SHEET_NAMES.forEach(function (name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp', 'message']);
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 180);
      sheet.setColumnWidth(2, 480);
    }
  });
  Logger.log('완료: ' + SHEET_NAMES.length + '개 탭');
}
