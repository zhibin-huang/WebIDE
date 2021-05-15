#!/bin/bash

BASEDIR=$(cd "$(dirname "$0")"; pwd)

PROG_NAME=$(basename $0)

BACKEND=$BASEDIR/backend
FRONTEND=$BASEDIR/frontend
FRONTEND_WEBJARS=$BASEDIR/frontend-webjars
CONTAINER=webide
export JAVA_HOME=$(/usr/libexec/java_home -v1.8)

valid_last_cmd() {
  if [ $? -ne 0 ]; then
      exit 1
  fi
}

sub_help(){
  echo "Usage: $PROG_NAME <subcommand>"
  echo ""
  echo "Subcommands:"
  echo "  build [-t tag]"
  echo "  run [-p port]"
  echo ""
  echo "For help with each subcommand run:"
  echo "$PROG_NAME <subcommand> -h | --help"
  echo ""
}

sub_backend() {
  bakend_usage() {
      echo "Usage: $PROG_NAME backend [clean]"
  }

  case $1 in
    "-h" | "--help")
      backend_usage
      ;;
    "clean")
      cd $BACKEND
        mvn clean
      cd $BASEDIR
    ;;
  esac
}

do_build_frontend() {
  cd $FRONTEND
  echo "building frontend..."
  yarn install
  yarn run build
  valid_last_cmd

  cd $FRONTEND_WEBJARS
  echo "packing frontend...."
  mvn clean install
  valid_last_cmd
  cd $BASEDIR
}

do_build_backend() {
  cd $BACKEND
  echo "mvn clean and packaging..."
  mvn clean package -Dmaven.test.skip=true
  valid_last_cmd
  cd $BASEDIR
}

sub_build() {

    build_usage() {
        echo "Usage: $PROG_NAME build [frontend | backend | run]"
    }

    case $1 in
    "-h" | "--help")
      build_usage
      ;;
    "")
      do_build_frontend
      do_build_backend
      ;;
    "backend")
      do_build_backend
      ;;
    "frontend")
      do_build_frontend
      ;;
    "run") # build and run
      do_build_frontend
      do_build_backend
      do_run_backend
      ;;
    esac
}

error() {
  printf  "${RED}ERROR:${NC} %s\n" "${1}"
}

error_exit() {
#  echo  "---------------------------------------"
#  error "!!!"
  error "${1}"
#  error "!!!"
#  echo  "---------------------------------------"
  exit 1
}



do_run_backend() {
  if [ ! -f $BACKEND/target/ide-backend.jar ]; then
     sub_build
  fi
  . $BASEDIR/config
  java -jar $BACKEND/target/ide-backend.jar --PTY_LIB_FOLDER=$BACKEND/src/main/resources/lib ${1}
}

sub_run() {
    local OPTIND opt
    run_usage() {
        echo "Usage: $PROG_NAME run [-p port]"
    }

    # process options
    while getopts ":p:" opt; do
      case $opt in
        p)
          EXTRA_VARS="--server.port=${OPTARG}"
          ;;
        \?)
          run_usage
          exit 1
          ;;
      esac
    done

    shift $((OPTIND-1))

    case $1 in
    "-h" | "--help")
        run_usage
        ;;
    "")
        do_run_backend $EXTRA_VARS
        ;;
    esac
}

# process subcommands
subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift

        sub_${subcommand} $@

        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$PROG_NAME --help' for a list of known subcommands." >&2
            exit 1
        fi
    ;;
esac
