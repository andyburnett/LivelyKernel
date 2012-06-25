module('lively.morphic.SAPUI5').requires('lively.morphic.HTML').toRun(function() {

lively.morphic.Morph.subclass('lively.morphic.SAPUI5.SuperButton',
'initializing', {
    initialize: function($super, label) {
        $super(this.createShape(label));
    },
    createShape: function(label) {
        var node = XHTMLNS.create('button');
        node.style.padding="0";
        node.innerHTML = label;
        return new lively.morphic.Shapes.External(node);
    },
},
'accessing', {

},
'event handling', {
    onClick: function(evt) {
        // for halos/menus
         if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) {
            evt.stop()
            return true;
        }
        // we do it ourselves
        return true;
     },
},
'serialization', {
    prepareForNewRenderContext: function ($super, renderCtx) {
        $super(renderCtx);
    },
});

lively.morphic.Box.subclass('lively.morphic.SAPUI5.Button',

'settings',{
    classes: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnStd',    
    activeClasses: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnAct',
    label: "Button"
},
'HTML render settings', {
    htmlDispatchTable: {
        updateLabel: 'updateLabelHTML',
        resizeButton: 'resizeButtonHTML',
        getButtonExtent: 'getButtonExtentHTML',
    },
},
'initializing', {
    initialize: function($super, bounds, optLabel) {
        $super(bounds);
        if (optLabel) this.setLabel(optLabel);
        this.setNodeClass(this.classes);
    }
},

'rendering', {
    initHTML: function($super, ctx) {
        if (!ctx.buttonNode)
            ctx.buttonNode= this.createButtonNodeHTML();
        ctx.subNodes = [];
        $super(ctx);
        if (this.shape) this.updateLabel(this.label || "Button")
    },
    appendHTML: function($super, ctx, optMorphAfter) {
        $super(ctx, optMorphAfter);
        this.appendButtonHTML(ctx);
    },
    appendButtonHTML: function(ctx) {
        ctx.shapeNode.appendChild(ctx.buttonNode);
        this.resizeButtonHTML(ctx);
    },

    setClipModeHTML: function(ctx, clipMode) {
        // FIXME duplication wiht super, delay logic
        // can be extracted
        if (!ctx.buttonNode || this.delayedClipMode) {
            this.delayedClipMode = clipMode;
            return;
        }
        this.setClipModeHTMLForNode(ctx, ctx.buttonNode, clipMode);
    },
    resizeButtonHTML: function(ctx) {
        var borderWidth = this.getBorderWidth(),
            extent = this.getExtent().subPt(pt(2*borderWidth, 2*borderWidth)),
            buttonNode= ctx.buttonNode;
        buttonNode.style.left = this.shape.getPosition().x /*+ this.padding.left()*/ + 'px';
        buttonNode.style.top = this.shape.getPosition().y /*+ this.padding.top()*/ + 'px';
        buttonNode.style.width = extent.x /*- this.padding.right() - this.padding.left())*/ + 'px';
        buttonNode.style.height = extent.y /*- this.padding.bottom() - this.padding.top()*/ + 'px';
    },
    updateLabelHTML: function(ctx, label) {
        ctx.buttonNode.innerHTML = label;
    }
},

'node creation', {
    createButtonNodeHTML: function() {
        var node = XHTMLNS.create('button');
        return node;
    },
    getButtonExtentHTML: function(ctx) {
        return ctx.buttonNode.scrollHeight != 0 ? pt(ctx.buttonNode.scrollWidth, ctx.buttonNode.scrollHeight) : this.getExtent()
    },
},

'accessing', {
    setExtent: function($super, extent) {
        $super(extent);
        this.resizeButton();
    },
    resizeButton: function(idx) {
        return this.renderContextDispatch('resizeButton');
    },
    getButtonExtent: function() { return this.renderContextDispatch('getButtonExtent') },
    updateLabel: function(label) {
        this.label = label;
        this.renderContextDispatch('updateLabel', label);
    },
    setLabel: function(label) {
        this.updateLabel(label);
    },
    getLabel: function() {
        return this.label;    
    },
    morphMenuItems: function($super) {
        var self = this, items = $super();
        items.push([
            'Set label', function(evt) {
            $world.prompt('Set label', function(input) {
                if (input !== null)
                    self.setLabel(input || '');
            }, self.getLabel());
        }])
        return items;
    },
    
},
'event handling', {

    onClick: function(evt) {
         if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) {
            evt.stop()
            return true;
        }
        lively.bindings.signal(this, 'fire', true);
         return true;
     },

}
);


}) // end of module