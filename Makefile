deploy: _site
	@echo 'Deploying to ${BERNA}'
	@rsync -avz _site/ $$BERNA:~/www/work/jtetypes
