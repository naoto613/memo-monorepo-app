#!/bin/bash

echo "コミットメッセージを作成します"
echo "コミットの変更対象を番号で選択してください"

select commit_target in front api other
do
  if [ -z "$commit_target" ]; then
    echo '番号が不正です'
    exit
  fi
  break
done

echo "コミットの変更対象: $commit_target"

echo "コミットの種類を番号で選択してください"

select commit_type in chore feat test fix docs ci refactor revert style
do
  if [ -z "$commit_type" ]; then
    echo '番号が不正です'
    exit
  fi
  break
done

echo "コミットの種類: $commit_type"

echo "変更内容を入力してください"
read -r content

git commit -m "$commit_type($commit_target): $content"
