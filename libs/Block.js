Block = f.unit({
	etag: 'div',
	ename: 'block',
	value: null,

	visibleMethod: dom.display,
	cacheSize: true,

	init: function(options) {
		f.copy(this, options)

		this.protochain.forEach(f.callown('create', this))
		this.protochain.forEach(f.callown('createPost', this))
	},

	create: function() {
		if(!this.visible) {
			this.visible = new Gate(Gate.AND, !this.hidden)
		}
		if(!this.events) {
			this.events = new EventEmitter
		}
		if(!this.element) {
			this.element = dom.elem(this.etag, null, this.eroot)
		}
		dom.addclass(this.element, this.ename)
	},

	createPost: function() {
		this.visible.events.on('change', this.visibleMethod, this, this.element)

		if(this.text) {
			dom.text(this.element, this.text)
		}
		if(this.etitle) {
			this.element.setAttribute('title', this.etitle)
		}
		if(this.eicon) {
			Atlas.set(this.element, this.eicon)
		}
	},

	destroy: function() {
		if(this.eicon) {
			Atlas.free(this.element)
		}
	},

	proxyEvent: function(name, func, scope, element) {
		this.events.on(name, func, scope || this)
		dom.on(name, element || this.element, this.events.will(name))
	},

	resize: function(w, h) {
		w = w |0
		h = h |0

		if(this.cacheSize
		&& this.width  === w
		&& this.height === h) return

		this.element.style.width  = w +'px'
		this.element.style.height = h +'px'

		this.width  = w
		this.height = h
		this.onresize()
	},

	autoresize: function() {
		this.element.style.width  = ''
		this.element.style.height = ''

		var w = this.element.offsetWidth
		,   h = this.element.offsetHeight

		if(this.cacheSize
		&& this.width  === w
		&& this.height === h) return

		this.width  = w
		this.height = h
		this.onresize()
	},

	onresize: function() {

	}
})


Block.Input = f.unit(Block, {
	ename: 'block-input',

	busChange: null,
	busOptions: null,
	value: null,
	equalCheck: true,

	createPost: function() {
		if(this.busChange) {
			this.busChangeNode = main.bus.on(this.busChange, this.set, this)
		}
		if(this.busOptions) {
			this.busOptionsNode = main.bus.on(this.busOptions, this.setOptions, this)
		}
	},

	setUpdate: function(value) {
		var prev = this.value

		if(this.set(value)) {
			this.events.emit('change', [this.value, prev])

			if(this.busChange) this.busChangeNode.emit([this.value, prev])
		}
	},

	set: function(value) {
		var prev = this.value

		if(this.equalCheck) {
			if(this.equalValues
				? this.equalValues(prev, value)
				: prev === value) return false
		}

		this.value = value

		if(this.setToElement) {
			this.setToElement(value, prev)
		}

		return true
	}
})


Block.InputElement = f.unit(Block.Input, {
	etag: 'input',
	etype: 'text',
	ename: 'block-input-element',

	listenChange: true,
	listenInput: false,

	create: function() {
		if(this.etype && this.etag === 'input') {
			this.element.setAttribute('type', this.etype)
		}
	},

	createPost: function() {
		var setFromElement = f.binds(this.setFromElement, this)

		if(this.listenChange) {
			dom.on('change', this.element, setFromElement)
		}
		if(this.listenInput) {
			dom.on('input', this.element, setFromElement)
		}
	},

	setFromElement: function() {
		this.setUpdate(this.getFromElement())
	},

	getFromElement: function() {
		return this.element.value
	},

	setToElement: function(value) {
		this.element.value = value
	}
})

Block.InputCheckbox = f.unit(Block.InputElement, {
	etype: 'checkbox',

	setToElement: function(value) {
		this.element.checked = !!value
	},

	getFromElement: function() {
		return this.element.checked
	}
})


Block.InputSelect = f.unit(Block.InputElement, {
	etag: 'select',
	ename: 'block-select-element',
	cname: 'block-select-element-option',
	defaultOption: null,

	create: function() {
		this.options = []
		this.emptyOptions()
	},

	setOptions: function(options) {
		this.emptyOptions()
		this.addOptions(options)
	},

	emptyOptions: function() {
		while(this.options.length) this.removeOption(this.options[0])
		this.addOption(this.defaultOption)
	},

	selectOption: function(option) {
		return this.set(option && option.value)
	},

	selectIndex: function(index) {
		return this.selectOption(this.options[index])
	},

	selectValue: function(value) {
		return this.set(value)
	},

	removeOption: function(option) {
		var index = this.options.indexOf(option)
		if(index === -1) return

		dom.remove(option.elem)
		this.options.splice(index, 1)

		if(index === this.selectedIndex) {
			if(this.options.length) {
				this.selectIndex(0)
			} else {
				this.selectIndex(-1)
			}
		}
	},

	remove: function(index) {
		this.removeOption(this.options[index])
	},

	addOptions: function(options) {
		options.forEach(this.addOption, this)

		if(this.selectedIndex === -1) {
			this.selectOption(this.options[0])
		}

		this.setFromElement()
	},

	add: function (elem) {
		return this.addOption({
			value: elem.value,
			text: elem.textContent
		})
	},

	addOption: function(item) {
		if(!item) return

		var elem = dom.elem('option', this.cname, this.element)
		elem.value = item.value
		dom.text(elem, item.text)

		var option = f.merge(item, { elem: elem })

		this.options.push(option)
		return elem
	},

	updateState: function() {
		for(var i = this.options.length -1; i >= 0; i--) {
			var option = this.options[i]
			if(option.value === this.value) break
		}

		this.selectedIndex = i

		if(i === -1) {
			this.selectedValue  = null
			this.selectedOption = null
		} else {
			this.selectedValue  = option.value
			this.selectedOption = option
		}
	},

	setToElement: function() {
		this.element.value = this.value
		this.updateState()
	}
})



Block.Select = f.unit(Block.InputSelect, {
	etag: 'div',
	ename: 'block-select',
	cname: 'block-select-option hand',
	hname: 'block-select-option-hover',
	handed: true,

	listenChange: false,
	listenInput: false,

	itemHeight: 19,
	maxListHeight: 500,
	defaultOption: null,
	listVisible: null,

	create: function() {
		this.options = []

		this.createDisplay()
		this.ehide = dom.div('block-select-hide', this.element)
		this.arrow = dom.div('block-select-arrow absmid', this.ehide)
		this.list = dom.div('block-select-list', document.body)

		dom.on('tap', this.element, f.binds(this.toggleList, this))

		if(this.handed) dom.addclass(this.element, 'hand')
		dom.addclass(this.element, 'block-select')

		this.bindBlur = f.binds(this.blur, this)

		this.scrollbarWidth = this.getScrollbarWidth()

		this.showList(false)
	},

	createDisplay: function() {
		this.etext = dom.span('block-select-text', this.element)
	},

	toggleList: function() {
		this.showList(!this.listVisible)
	},

	showList: function(listVisible) {
		if(this.listVisible === !!listVisible) return
		this.listVisible = !!listVisible

		dom.display(this.list, this.listVisible)
		dom.text(this.arrow, this.listVisible ? '▲' : '▼')

		if(this.listVisible) {
			this.moveList()

			dom.on('tap', window, this.bindBlur)
		} else {
			dom.off('tap', window, this.bindBlur)
		}
	},

	blur: function(e) {
		if(dom.ancestor(e.target, this.element)
		|| dom.ancestor(e.target, this.list)) return

		this.showList(false)
	},

	hover: function(option) {
		if(this.hoverOption) {
			dom.remclass(this.hoverOption.elem, this.hname)
			delete this.hoverOption
		}

		this.hoverOption = option

		if(this.hoverOption) {
			dom.addclass(this.hoverOption.elem, this.hname)
		}
	},

	onover: function(option, e) {
		this.hover(option)
	},

	onout: function(option, e) {
		this.hover(null)
	},

	ontap: function(option, e) {
		this.showList(false)
		this.setUpdate(option.value)
	},

	moveList: function() {
		var offset = dom.offset(this.element)
		,   width  = this.element.offsetWidth
		,   height = this.element.offsetHeight

		this.list.style.left = offset.x +'px'
		this.list.style.top  = offset.y + height +'px'
		this.list.style.width  = ''
		this.list.style.height = ''

		var listWidth  = this.list.offsetWidth
		,   listHeight = this.list.offsetHeight
		,   maxHeight  = this.maxListHeight

		var resultWidth  = Math.max(listWidth +1, width)
		,   resultHeight = Math.min(listHeight, maxHeight)

		if(listHeight > maxHeight) {
			resultWidth += this.scrollbarWidth
		}

		this.list.style.width  = resultWidth  +'px'
		this.list.style.height = resultHeight +'px'
	},

	updateDisplay: function(option) {
		if(option) {
			dom.text(this.etext, option.text)

		} else {
			dom.text(this.etext, '')
		}
	},

	addOption: function(item) {
		if(!item) return

		var elem = dom.div(this.cname, this.list)
		if(this.handed) dom.addclass(elem, 'hand')
		dom.addclass(elem, 'block-select-option')

		var option = f.copy({}, item)

		option.elem   = elem
		option.ontap  = f.binda(this.ontap,  this, [option])
		option.onover = f.binda(this.onover, this, [option])
		option.onout  = f.binda(this.onout,  this, [option])

		dom.on('tap', elem, option.ontap)
		dom.on('mouseenter', elem, option.onover)
		dom.on('mouseleave', elem, option.onout)

		this.makeOption(option)
		this.options.push(option)
		return option
	},

	makeOption: function(option) {
		dom.text(option.elem, option.text)
	},

	setToElement: function() {
		this.updateState()
		this.updateDisplay(this.selectedOption)
	},

	getScrollbarWidth: function() {
		 var inner = document.createElement('div')
		 ,   outer = document.createElement('div')
		 ,   root  = document.body || document.documentElement
		 ,   width

		 outer.style.position = 'absolute'
		 outer.style.overflow = 'scroll'
		 outer.appendChild(inner)
		 root.appendChild(outer)
		 width = outer.offsetWidth
		 root.removeChild(outer)
		 return width
	}
})


Block.Toggle = f.unit(Block, {
	ename: 'toggle',

	auto: true,
	active: true,
	disabled: false,
	handed: true,

	activeName: 'active',
	disabledName: 'disabled',

	create: function() {
		this.update()
		this.proxyEvent('tap', this.ontap)
	},

	set: function(active, emitEvent) {
		if(this.active == active
		|| this.disabled) return false

		this.active = active
		this.update()

		emitEvent && this.events.emit('change', this.active)
		return true
	},

	toggle: function(emitEvent) {
		this.set(!this.active, emitEvent)
	},

	ontap: function() {
		if(this.auto) this.toggle(true)
	},

	update: function() {
		dom.togclass(this.element, this.activeName,   this.active)
		dom.togclass(this.element, this.disabledName, this.disabled)
		if(this.handed) dom.togclass(this.element, 'hand', !this.active)
	}
})


Block.FiniteState = f.unit(Block, {
	ename: 'block-fsm',

	state: null,

	stateList: [],
	stateAllow: {},
	stateForbid: {},

	createPost: function() {
		if(this.state) this.transition(this.state, false, true)
	},

	transition: function(state, silent, force) {
		var prevState = this.state

		if(!force && prevState === state) return

		if(!force && prevState) {

			var allowed = this.stateAllow[prevState] || this.stateList
			if(allowed.indexOf(state) === -1) {
				return
			}

			var forbidden = this.stateForbid[prevState]
			if(forbidden && forbidden.indexOf(state) !== -1) {
				return
			}
		}

		if(!silent) {
			this.applyState(state, prevState)
		}

		this.state = state

		if(!silent) {
			this.events.emit('state', [state, prevState])
		}
	},

	applyState: function(nextState, prevState) {

	}
})


Block.PikadayInput = f.unit(Block.InputElement, {
	placeholder: 'дд.мм.гггг',

	create: function() {
		this.datepicker = new Pikaday({
			field: this.element,
			minDate: this.minDate ? this.minDate : undefined,
			maxDate: this.maxDate ? this.maxDate : undefined
		})

		this.element.placeholder = this.placeholder
	},

	setToElement: function(value) {
		this.datepicker.setDate(new Date(value), true)
	},

	getFromElement: function() {
		return this.datepicker.getDate().getTime()
	}
})
