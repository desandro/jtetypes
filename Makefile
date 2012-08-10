
build_dir=_site

refresh:
	@rm -rf ${build_dir}
	@rsync -az --exclude=".*" --exclude="modules/jquery-bbq/*/" ./ ${build_dir}

build: index.html
	@echo copying files to _site/
	make refresh
	grunt build

dev: index.html
	make refresh
	grunt build:dev

deploy: _site
	@echo 'Deploying to ${BERNA}'
	@rsync -avz _site/ $$BERNA:~/www/work/jtetypes
