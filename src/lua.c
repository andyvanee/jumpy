#include <stdio.h>

#include <emscripten/emscripten.h>

#include "lauxlib.h"
#include "lua.h"
#include "lualib.h"

int main()
{}

int runMain(char *code) {
  lua_State *L = luaL_newstate();
  int luaError = 0;
  luaL_openlibs(L);            /* opens the standard libraries */

  luaError = luaL_dostring(L, code);

  if (luaError) {
    fprintf(stderr, "Couldn't parse line: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
    return 1;
  }

  return 0;
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE void myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
}
