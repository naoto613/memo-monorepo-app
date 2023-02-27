#!/bin/bash

echo "指定したバージョンのコミットまでrevertするPRを作成します"
echo "バージョンを番号で指定してください"

git fetch --tags

select TAG in $(git tag -l --sort -refname | head)
do
  if [ -z "$TAG" ]; then
    echo '番号が不正です'
    exit
  fi
  break
done

echo "$TAG までrevertするPRを作成してもよろしいですか？"

select REPRY in YES NO
do
  if [ $REPRY != "YES" ]; then
    echo '処理を終了しました'
    exit
  fi
  break
done

echo "main branchに切り替えて最新のリソースを取得します"
git switch main
git pull origin main

echo "revert用のbranchを作成し、リポジトリにpushします"
git switch -c revert/to-$TAG origin/main

git reset --hard $TAG
git reset --soft HEAD@{1}
git commit -m "revert(*): Revert to $TAG"

git push -u origin revert/to-$TAG -f

echo "main branchに切り替えてrevert用のbranchを削除します"
git switch main
git branch -D revert-to-$TAG

echo "処理が完了しました。PRを作成してください"
