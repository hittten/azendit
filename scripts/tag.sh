#!/bin/bash

commits=(
  ""    #observables
  ""    #search
  ""    #http-fetch
  ""    #api-search-task
  ""    #api-delete-task
  ""    #api-update-task
  ""    #api-create-task
  ""    #api-tasks-filters
  ""    #api-typescript
  ""    #api-get-tasks
  ""    #api-setup
  ""    #promises
  ""    #delete-task
  ""    #edit-task
  ""    #modules
  ""    #webpack
  ""    #task-done
  ""    #filters
  ""    #create-task
  ""    #mock-list
  ""    #start
  ""    #init
)
tags=(
  "observables"
  "search"
  "http-fetch"
  "api-search-task"
  "api-delete-task"
  "api-update-task"
  "api-create-task"
  "api-tasks-filters"
  "api-typescript"
  "api-get-tasks"
  "api-setup"
  "promises"
  "delete-task"
  "edit-task"
  "modules"
  "webpack"
  "task-done"
  "filters"
  "create-task"
  "mock-list"
  "start"
  "init"
)

# get length of an array
tagsLength=${#tags[@]}

# use for loop to read all values and indexes
for (( i=0; i<${tagsLength}; i++ ));
do
  if [ "${commits[$i]}" != "" ]
  then
    echo "Tagging: ${commits[$i]} with tag: ${tags[$i]}"
    git co "${commits[$i]}"
    git tag -a "${tags[$i]}" -m ${tags[$i]} --force
  else
    echo "Skip: ${tags[$i]}"
  fi
done

git co main
