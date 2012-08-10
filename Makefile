
build_dir=_site

build: index.html
	@echo copying files to _site/
	@rm -rf ${build_dir}
	@rsync -az --exclude=".*" --exclude="modules/jquery-bbq/*/" ./ ${build_dir}
	grunt build

deploy: _site
	@echo 'Deploying to ${BERNA}'
	@rsync -avz _site/ $$BERNA:~/www/work/jtetypes
