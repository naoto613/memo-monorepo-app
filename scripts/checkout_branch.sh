#!/bin/bash

echo "Issueに紐づくブランチを新たに作成します"
echo "PRの種類を選択してください"

select pr_type in feat bug docs chore env revert
do
  if [ -z "$pr_type" ]; then
    echo '番号が不正です'
    exit
  fi
  break
done

echo "PRの種類: $commit_target"

echo "Issue番号を入力してください"
read -r issue_number

echo "branchを識別する文言を入力してください（不要の場合はそのままEnter）"
read -r serial_number

if [ -n "$serial_number" ]; then
  git switch -c $pr_type/$issue_number-$serial_number
  exit
fi

git switch -c $pr_type/$issue_number
