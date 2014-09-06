var massahHelper = require('massah/helper')
  , helper = massahHelper.application.helper

module.exports = (function() {
    var library = massahHelper.getLibrary()
        .when('I create a card', function() {
            new massahHelper.Webdriver.ActionSequence(this.driver)
               .doubleClick(this.driver.element('div.viewport-container div'))
               .perform()
        })
        .when('I click delete', function() {
            this.driver.element('div.card textarea').click()
            this.driver.element('div.card .card-delete').click()
        })
        .when('I click zoom', function() {
            this.driver.element('div.card textarea').click()
            this.driver.element('div.card .card-zoom').click()
        })
        .when('I click to zoom out', function() {
            this.driver.element('div.card textarea').click()
            this.driver.element('div.card .card-zoom').click()
        })
        .when('I click for card link', function() {
            this.driver.element('div.card textarea').click()
            this.driver.element('div.card .card-link').click()
        })
        .then('I see a card', function() {
            this.driver.elements('div.card').count(function(cardCount) {
                cardCount.should.equal(1)
            })
        })
        .then('I see ([0-9]*) cards', function(count) {
            count = parseInt(count)
            this.driver.elements('div.card').count(function(cardCount) {
                cardCount.should.equal(count)
            })
        })
        .then('I see the card elements', function() {
            var cardId = null
            this.driver.element('div.card').attr('draggable', function(draggable) {
                draggable.should.equal('true')
            })
            this.driver.element('div.card').attr('class', function(cssClass) {
                cssClass.should.include('card')
                cssClass.should.include('draggable')
                cssClass.should.include('card-yellow')
                cssClass.should.include('ui-draggable')
                cssClass.should.include('ui-resizable')
            })
            this.driver.element('div.card').attr('id', function(id) {
                id.should.match(/^[a-f0-9]{24}$/)
                cardId = id
            })
            this.driver.element('div.card').css('height', function(height) {
                height.should.equal('150px')
            })
            this.driver.element('div.card').css('width', function(width) {
                width.should.equal('150px')
            })
            this.driver.element('div.card').css('position', function(position) {
                position.should.equal('absolute')
            })
            this.driver.element('div.card a').attr('name', function(name) {
                name.should.match(/^[a-f0-9]{24}$/)
                name.should.equal(cardId)
            })
            var cardLinkSelector = 'div.card div.controls ' +
                'i.icon-magnet.card-link'
            this.driver.element(cardLinkSelector).attr('title', function(title) {
                title.should.include(helper.baseUrl)
                title.should.include(cardId)
            })
            var cardDeleteSelector = 'div.card div.controls ' +
                'i.icon-remove.card-delete.write'
            this.driver.element(cardDeleteSelector).attr('title', function(title) {
                title.should.equal('Delete card')
            })
            var cardColourSelector = 'div.card div.controls ' +
                'i.icon-eye-open.card-colour.write'
            this.driver.element(cardColourSelector).attr('title', function(title) {
                title.should.equal('Change card colour')
            })
            var cardZoomSelector = 'div.card div.controls ' +
                'i.icon-zoom-in.card-zoom'
            this.driver.element(cardZoomSelector).attr('title', function(title) {
                title.should.equal('Zoom in on this card')
            })
            this.driver.element('div.card div.ui-resizable-handle').attr('class', function(cssClass) {
                cssClass.should.include('ui-resizable-handle')
                cssClass.should.include('ui-resizable-se')
                cssClass.should.include('ui-icon')
                cssClass.should.include('ui-icon-gripsmall-diagonal-se')
            })
            this.driver.element('div.card textarea').then(
                function() {},
                function() { throw new Error('Missing card element') }
            )
        })
        .then('I see a zoomed card', function() {
            this.driver.element('body').attr('style', function(style) {
                var scale = style.split('scale(')[1].split(')')[0]
                scale = parseFloat(scale)
                scale.should.be.greaterThan(1)
            })
        })
        .then('I see a reset view', function() {
            this.driver.element('body').attr('style', function(style) {
                var scale = style.split('scale(')[1].split(')')[0]
                scale = parseFloat(scale)
                scale.should.equal(1)
            })
        })
        .define('[When|Then|And] I see the link modal', function() {
            var driver = this.driver
            driver.wait(function() {
                return driver.element('#card-link-modal .modal-body').then(
                    function() { return true },
                    function() { return false }
                )
            }, 5000, 'Waiting for link modal to appear')
        })
        .then('the expected link modal elements', function() {
            var selector = '#card-link-modal .modal-header button.close'
            var params = this.params
            this.driver.element(selector).html(function(html) {
                html.should.equal('×')
            })
            var headerSelector = '#card-link-modal .modal-header h3'
            this.driver.element(headerSelector).html(function(header) {
                header.should.equal('Link to this card')
            })
            var cardLinkSelector = '#card-link-modal .modal-body div.card-link a'
            this.driver.element(cardLinkSelector).attr('href', function(link) {
                link.should.include(helper.baseUrl + '/' + params.boardId + '#')
                link.should.match(/.*#[a-f0-9]{24}$/)
            })
            var closeSelector = '#card-link-modal .modal-footer ' +
                'button#close-card-link-modal'
            this.driver.element(closeSelector).html(function(label) {
                label.should.equal('Close')
            })
        })
        .then('the card link modal is closed', function() {
            var driver = this.driver
            driver.wait(function() {
                return driver.element('#card-link-modal').isDisplayed(function(visible) {
                    return visible === false
                })
            }, 5000, 'Waiting for the card link modal to close')
        })
    
    return library
})()