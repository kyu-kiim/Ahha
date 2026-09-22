#!/usr/bin/env bash
# 학생 페이지 폴더를 만든다. (선택 사항 — 기존 폴더를 복사해서 data-page만 바꿔도 된다)
#   사용법: ./new-page.sh 18-newname
#   그 다음 config.js 의 STUDENTS 에 { id: '18-newname', name: '...', doc: '', drive: '' } 한 줄 추가,
#   Apps Script 의 SHEET_NAMES 에도 추가하고 setupSheets() 한 번 실행.
set -euo pipefail

id="${1:?사용법: ./new-page.sh 18-newname}"
if [[ ! "$id" =~ ^[A-Za-z0-9_-]{1,40}$ ]]; then
  echo "폴더 이름은 영문/숫자/-/_ 만 가능: $id" >&2
  exit 1
fi

cd "$(dirname "$0")"
mkdir -p "$id"
sed -e "s/data-page=\"home\"/data-page=\"$id\"/" \
    -e 's/data-root="\."/data-root=".."/' \
    -e 's#href="\./#href="../#g' \
    -e 's#src="\./#src="../#g' \
    index.html > "$id/index.html"
echo "만들었음: $id/index.html"
