
build: components index.js
	@component build

components: component.json
	@component install

clean:
	rm -fr build components

.PHONY: clean
