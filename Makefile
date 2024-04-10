ROOTDIR = $(shell pwd)
BUILD = $(ROOTDIR)/.build
ASSETS = $(ROOTDIR)/site/assets
EMSDK = $(BUILD)/emsdk/emsdk activate latest && source $(BUILD)/emsdk/emsdk_env.sh
EMOPTS = -s MODULARIZE -s EXPORT_ES6 -s EXPORTED_FUNCTIONS="['_runMain','_main']" -s EXPORTED_RUNTIME_METHODS="['stringToNewUTF8']"
LIBLUA = $(BUILD)/lua/lib/liblua.a

FONT = $(ASSETS)/jumpy-font.json

.PHONY: all clean clean-all
default: site/lua.js $(FONT)

site/lua.js: $(LIBLUA) src/lua.c
	$(EMSDK) && emcc -std=c89 src/lua.c -o site/lua.js $(EMOPTS) -llua -L$(BUILD)/lua/lib -I$(BUILD)/lua/include

$(FONT): $(ASSETS)/jumpy-font.png
	bun run src/compileFont.ts

clean:
	cd $(BUILD)/lua-5.4.6 && make clean
	rm -rf $(BUILD)/lua
	rm -rf site/lua.js site/lua.wasm

clean-all: clean
	rm -rf $(BUILD)

$(BUILD)/lua-5.4.6.tar.gz:
	mkdir -p $(BUILD)
	cd $(BUILD) && curl -L -O https://www.lua.org/ftp/lua-5.4.6.tar.gz

$(BUILD)/lua-5.4.6: $(BUILD)/lua-5.4.6.tar.gz
	cd $(BUILD) && tar zxf lua-5.4.6.tar.gz

$(LIBLUA): $(BUILD)/lua-5.4.6 $(BUILD)/emsdk/.emscripten lua-emcc-Makefile
	cp lua-emcc-Makefile $(BUILD)/lua-5.4.6/src/Makefile
	$(EMSDK) && cd $(BUILD)/lua-5.4.6 && emmake make posix && make install INSTALL_TOP=$(BUILD)/lua
	touch $(LIBLUA)

$(BUILD)/emsdk:
	mkdir -p $(BUILD)
	git clone https://github.com/emscripten-core/emsdk.git $(BUILD)/emsdk
	rm -rf $(BUILD)/emsdk/.git

$(BUILD)/emsdk/.emscripten: $(BUILD)/emsdk
	cd $(BUILD)/emsdk && ./emsdk install latest
