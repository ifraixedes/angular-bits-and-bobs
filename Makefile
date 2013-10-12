
.PHONY: doc demo

clean:
	rm -rf build
	mkdir build

doc: 
	yuidoc -C doc/yuidoc.json -t doc/theme src

demo: 
	cp -rf demo/app.js demo/index.html demo/views demo/ctrls demo/img build
	mkdir -p build/styles/purecss
	cp demo/styles/purecss/*min.css build/styles/purecss
	cp demo/styles/*.css build/styles

ghpage: clean demo doc
