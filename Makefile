
.PHONY: doc demo

clean:
	rm -rf build
	mkdir build

doc: 
	yuidoc -C doc/yuidoc.json -t doc/theme src

demo: 
	cp -rf demo/app.js demo/views demo/ctrls demo/img build
	mkdir -p build/styles/purecss
	cp demo/styles/purecss/*min.css build/styles/purecss
	cp demo/styles/*.css build/styles
	cp -rf src build/lib
	mkdir build/vendor
	cp libs/angular*/angular.min.js build/vendor
	cp libs/moment.js build/vendor
	cp demo/index-ghp.html build/index.html

ghpage: clean demo doc


ghpage: clean demo doc
