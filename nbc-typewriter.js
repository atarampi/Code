/*
 * 
 * 
4/24  interative-radar
Version 525
tspinks
 * 
 */

nbc.articlePage = (nbc.hasOwnProperty('articlePage')) ? nbc.articlePage : {};
nbc.articlePage.continuousScroll = (nbc.isMobile === "true") ? ((nbc.mobileContScroll === "true") ? true : false) : ((nbc.desktopContScroll === "true") ? true : false);
nbc.activeTypewriters = new Array();
nbc.articleTools = new nbc.tools('articleTools');
nbc.articlePage.jsonLimit = 3; /* Limit - how many stories will be pulled down from json handler */
nbc.articlePage.currentURL = location.protocol + '//' + nbc.domain + window.location.pathname;
nbc.articlePage.currentTitle = document.title;
nbc.articlePage.currentSummary = jQuery("meta[property='og\\:description']").attr("content");
nbc.articlePage.defaultLeadWidth = 320;
nbc.articlePage.defaultLeadHeight = 180;
nbc.articlePage.dpr = nbc.articleTools.retinaScanner();
nbc.articlePage.leadScaleW = nbc.articlePage.defaultLeadWidth * nbc.articlePage.dpr;
nbc.articlePage.leadScaleH = nbc.articlePage.defaultLeadHeight * nbc.articlePage.dpr;
nbc.articlePage.historyScroll = null; /* timeout for history, in the case where user scrolls past many history waypoints quickly */
nbc.articlePage.clonedHeader = null; /* markup storage for investigation or feature headers */
nbc.articlePage.omnitureEventTrack = 9;
nbc.articlePage.activePlayersToPause = [];
nbc.articlePage.invHeader = false;
nbc.articlePage.blogHeader = false;
nbc.articlePage.checkEndGallery = function() {
    try {
        if (pg.galleryQueue !== null) {
            pg.endGallery(pg.galleryQueue)
        }
    } catch (e) {}
}

nbc.updateTopStories = function() {
    var currentQueue = nbc.wayPointControl.queue;
    var storyListHeaderText = "Trending Stories";
    jQuery.getJSON("/templates/nbc_chartbeat_heartbeat?host=" + nbc.host + "&limit=20&storyID=" + nbc.articlePage.thisArticleID + "&section=" + nbc.section + "&subsection=" + nbc.subsection, function(data) {
        if (data.length > 0) {
            var items = [];
            var setProperty = "trending stories";
            var checkItems = ['Video Release', 'Gallery', 'Exclusive', 'Opinion', 'Sponsored', 'Investigative', 'Photos', 'Video'];
            tagBuilder = function(tag, href) {
                if (tag == "Gallery" || tag == "gallery") {
                    tag = "Photos"
                } else if (tag == "Video Release") {
                    tag = "Video"
                }

                if (jQuery.inArray(tag, checkItems) < 0) {
                    return ''
                } else {
                    return '<a href="' + href + '"><span class="' + tag + '">' + tag + '</span></a>'
                }
            }
            jQuery.each(data, function(key, val) {
                if (val.sourceFrom == "RelStoryItem") {
                    storyListHeaderText = "Top Stories";
                }
                if (val.hasOwnProperty('path')) {
                    var path = val.path;
                    var sponsoredTag = "";
                    if (path.indexOf('http://') == -1) {
                        if (path.substring(0, 1) !== "/") {
                            path = 'http://' + path;
                        }
                    }
                    if (path.indexOf('http://') > -1) {
                        target = " target='new'"
                    }
                    var type = (val.hasOwnProperty('typeName')) ? val.typeName : "";
                    if (val.multimedia_in_lead_pos === "true") {
                        type = val.multimedia_typename
                    }
                    var tag = tagBuilder(type, path);
                    if (val.sourceFrom == "SponsoredItem") {
                        var adDartPixel = (val.dartPixel.length > 0) ? '<img src="' + val.dartPixel + '" width="1" height="1" alt="1x1 Pixel" />' : '';
                        path = (val.dartUrl.length > 0) ? val.dartUrl : path;
                        sponsoredTag = "<span class='Sponsored'>Sponsored" + adDartPixel + "</span>";

                    }
                    var target = "";

                    jQuery("#storyList-" + currentQueue).append("<li>" + sponsoredTag + tag + "<a name='&lpos=trending stories' href='" + path + "' " + target + ">" + val.title.split(" | ")[0] + "</a></li>");
                }
            });
            jQuery("#storyListHeader-" + currentQueue).text(storyListHeaderText);
            jQuery("#article-sec_" + currentQueue + " .topstories li, #article-sec_" + currentQueue + " .topstories li a").click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                var withinLI = jQuery(this).parent().is("li");
                var thisURL = (withinLI) ? jQuery(this).attr('href') : jQuery(this).find('a:first').attr('href');
                nbcu.forcedLinkTrackingTimeout = 800;
                nbcu.linkTrackVars = "eVar7";
                nbcu.eVar7 = setProperty;
                nbcu.linkTrackEvents = "None";
                nbcu.events = "None";
                if (withinLI) {
                    nbcu.tl(this, 'o', setProperty, null, 'navigate');
                } else {
                    nbcu.tl(this.childNodes[0], 'o', setProperty, null, 'navigate');
                }
            });
        } else {
            jQuery("#article-sec_" + currentQueue + " .topstories div.blackdivider1").hide();
        }
    })
};

nbc.articleInlinkTracking = function(queue) {
    jQuery('#article_' + queue + ' div[itemprop="articleBody"]').find('a').click(function(event) {
        var exitArray = nbcu.linkInternalFilters.split(',');
        var setProperty = "article inline link";
        var thisURL = jQuery(this).attr('href');
        var thisClass = jQuery(this).parents('div.embedded');
        var isExitLink = true;
        var target = (jQuery(this).attr('target') !== null) ? jQuery(this).attr('target') : '';
        if (thisClass.length > 0) {
            setProperty = "article speedbump";
        }

        for (i = 0; i < exitArray.length; i++) {
            if (thisURL.toLowerCase().indexOf(exitArray[i].toLowerCase()) > -1) {
                isExitLink = false;
            }
        }
        if (isExitLink) {
            setProperty += " exit";
        }
        nbcu.forcedLinkTrackingTimeout = 500;
        nbcu.linkTrackVars = "eVar7";
        nbcu.eVar7 = setProperty;
        nbcu.linkTrackEvents = "None";
        nbcu.events = "None";
        if (typeof jQuery(this).attr('onclick') !== "undefined") {
            event.preventDefault();
            if (jQuery(this).attr('onclick').indexOf('window.open') > -1) {
                nbcu.tl(this, 'o', setProperty, null);
            } else {
                nbcu.tl(this, 'o', setProperty, null, 'navigate');
            }
        } else if ((target === "_blank" || target === "new" || target === "_newtab")) {
            nbcu.tl(this, 'o', setProperty, null);
        } else {
            event.preventDefault();
            nbcu.tl(this, 'o', setProperty, null, 'navigate');
        }
    });
}

nbc.wayPointControl = {
    contentTrigger: null,
    queue: 0,
    presentQueue: 0,
    prevStoryNode: false,
    adRefreshInterval: false,
    wayPointTrigger: function(direction) {
        console.log(direction);
        jQuery('#loader').show();
        this.contentTrigger.waypoint('disable');
        nbc.wayPointControl.pausePlayer();
        if (nbc.wayPointControl.adRefreshInterval) {
            nbc.wayPointControl.adRefreshInterval = false;
            clearInterval(nbc.articlePage.intrvlLiveVideo)
        }
        nbc.wayPointControl.queue++;
        if (direction == 'down' && (nbc.articlePage.ra === null || nbc.articlePage.ra.length === 0)) {
            contentIdExtraction = nbc.articlePage.targetedArticles.splice(0, nbc.articlePage.jsonLimit);
            contentArray = contentIdExtraction.join(",");
            console.log('json ajax call fired');
            nbc.articlePage.tw.getArticles(contentArray);
        } else if (direction == 'down') {
            setTimeout(function() {
                nbc.articlePage.tw.buildArticle(nbc.articlePage.ra[0])
            }, 500);
        }
    },
    historyChange: function(context) {
        console.log('historyChange fired');
        clearTimeout(nbc.articlePage.historyScroll);
        nbc.articlePage.historyScroll = setTimeout(function() {

            var title = jQuery(context).find("h1.headline").html();
            console.log(title);
            var historyString = jQuery(context).attr('data-history');
            nbc.articleTools.makeFriendlyUrl({
                "state": historyString
            }, historyString, '', title, true, true);
        }, 100);
    },
    offsetOptions: {
        offset: '100%'
    },

    offsetNavHeader: {
        offset: function() {
            var headerHeight = jQuery('#masthead').height() + jQuery('#nav').height() + jQuery('#sectionNav').height();
            return -(headerHeight)
        }
    },

    absoluteNav: function(direction) {
        if (direction === "up") {
            jQuery('#stickyNav').fadeOut(300);
            if (getThePartnerCookie("partnerCookie") == "xfinity") {
                jQuery('#xfinityNavBar').css({
                    "position": "static"
                });
                jQuery('#header').css("top", 0)
            }
        } else {
            jQuery('#stickyNav').fadeIn(300);
            if (getThePartnerCookie("partnerCookie") == "xfinity") {
                jQuery('#xfinityNavBar').css({
                    "position": "fixed",
                    "z-index": 100000
                });
                jQuery('#header').css("top", 50)
            }
        }
    },

    historyTriggers: function(queue) {
        jQuery('#article-sec_' + queue).waypoint(function(direction) {
            if (direction == "down") {
                console.log('I hit 30% going down', queue);
                nbc.wayPointControl.historyChange(this)
            }
        }, {
            offset: function() {
                return 700;
            }
        });

        jQuery('#article-sec_' + queue).waypoint(function(direction) {

            if (direction == "up") {
                console.log('I HIT 50% going up', queue);
                nbc.wayPointControl.historyChange(this)
            }
        }, {
            offset: function() {
                return -jQuery(this).height() / 2;
            }
        });
    },

    upArrowControls: function() {
        jQuery('#article-sec_3').waypoint(function(direction) {
            if (direction == "down") {
                jQuery("#upwardScrollFixedRect").fadeIn(400);
                jQuery('#cScrollIndicatorRect').hide();
            } else {
                jQuery("#upwardScrollFixedRect").fadeOut(400)
            }
        }, {
            offset: '100%'
        });
    },
    pausePlayer: function() {
        $pdk.controller.pause(true, nbc.articlePage.activePlayersToPause, true);
    },
    eventListenerPausePlayer: function(queue, embedded) {

        var localQueue = queue;
        var videoPlayerType = "leadVideo" + localQueue
        if (typeof embedded !== "undefined") {
            videoPlayerType = embedded
        }
        console.log('PLAYER TYPE: ' + videoPlayerType);
        $pdk.controller.addEventListener("OnMediaStart", function() {
            if (nbc.articlePage.activePlayersToPause.indexOf('nbcLMPlayer' + videoPlayerType) == -1) {
                nbc.articlePage.activePlayersToPause.push('nbcLMPlayer' + videoPlayerType);
            }
            if (nbc.wayPointControl.presentQueue !== localQueue) {
                nbc.wayPointControl.pausePlayer();
                console.warn('deferred pause on ' + localQueue);
            }
            console.log('I AM LOADING VIDEO ' + videoPlayerType, nbc.articlePage.activePlayersToPause);
        }, ['nbcLMPlayer' + videoPlayerType]);

    },
    desktopVideoLead: function(queue) {
        var currentQueue = queue;
        var fwAdSlots = jQuery('.freewheelRightRail');
        jQuery(fwAdSlots[nbc.wayPointControl.presentQueue + 1]).addClass('_fwph');
        jQuery('#article_' + currentQueue + '_elements .leadMediaRegion').waypoint(function(direction) {
            jQuery('#leadVideo' + currentQueue + ' .videoPlayButton').click();
            nbc.wayPointControl.eventListenerPausePlayer(currentQueue);
        }, {
            offset: 'bottom-in-view',
            triggerOnce: true
        });
    },
    desktopCompanionActivation: function(queue) {
        var currentQueue = queue;
        jQuery('#article_' + currentQueue + '_elements .leadMediaRegion').waypoint(function(direction) {
            var fwAdSlots = jQuery('.freewheelRightRail');
            fwAdSlots.removeClass('_fwph');
            if (direction == "up") {
                jQuery(fwAdSlots[nbc.wayPointControl.presentQueue]).addClass('_fwph');
            } else {
                jQuery(fwAdSlots[nbc.wayPointControl.presentQueue]).removeClass('_fwph');
            }
        }, {
            offset: function() {
                return -jQuery(this).height();
            }
        });
    },

    omnitureTrigger: function(queue, history) {
        var currentQueue = queue;
        if (nbc.articlePage.omnitureEventTrack == 18) {
            nbc.articlePage.omnitureEventTrack = 8;
        }
        var omnitureTrigger = '#rect1-' + currentQueue;
        if (nbc.isMobile == "true") {
            omnitureTrigger = '#article_' + currentQueue + '_elements h1.headline';
        }
        jQuery(omnitureTrigger).waypoint(function() {
            nbcu.eVar6 = location.protocol + '//' + nbc.env + nbc.domain + history;
            nbcu.prop22 = nbcu.eVar22 = nbcu.eVar49 = nbc.articlePage.currentTitle;
            nbcu.prop21 = nbcu.eVar21 = nbc.articlePage.thisArticleID;
            nbcu.prop22 = nbcu.eVar22 = nbc.articlePage.thisAuthor;
            nbcu.prop28 = nbcu.eVar28 = nbc.articlePage.thisArticleSource;
            nbcu.eVar44 = nbc.articlePage.thisArticleFeature;

            nbcu.prop74 = nbcu.eVar74 = nbc.articlePage.thisArticleSponsor;
            if (nbc.articlePage.thisArticleSponsor == "page not sponsored") {
                nbcu.prop74 = null;
            }
            nbcu.eVar70 = nbc.articlePage.thisArticleCreateDate;
            if (nbc.isMobile == "true") {
                nbcu.eVar23 = nbcu.prop23 = "article";
            } else {
                nbcu.eVar23 = nbcu.prop23 = nbc.articlePage.thisPageType;
            }
            if (currentQueue < 10) {
                nbcu.eVar56 = "batch 1";
                nbcu.eVar58 = "1";
            } else {
                nbcu.eVar56 = "batch 2";
                nbcu.eVar58 = "2";
            }
            nbcu.eVar57 = currentQueue + 1;
            nbcu.events = "event1,event2,event" + nbc.articlePage.omnitureEventTrack + ",event18";
            nbcu.t();
            nbc.articlePage.omnitureEventTrack++;
        }, {
            offset: 'bottom-in-view',
            triggerOnce: true
        });
    },

    cScrollTurnOnAds: function(queue) {
        var currentQueue = queue;
        if (nbc.isMobile == "false") {
            jQuery('#leaderboard1-' + currentQueue).waypoint(function(direction) {
                if (direction === "up") {
                    nbc.wayPointControl.presentQueue--;
                    jQuery("#eyeDiv").detach();
                    jQuery("#adBackgroundContainer").fadeOut("slow", function() {
                        jQuery('body').removeAttr('style');
                        jQuery(this).removeAttr('style');
                    });
                    if (nbc.wayPointControl.adRefreshInterval) {
                        nbc.wayPointControl.adRefreshInterval = false;
                        clearInterval(nbc.articlePage.intrvlLiveVideo)
                    }
                } else {
                    nbc.wayPointControl.presentQueue++;
                }
                // ONLY 1 SLOT AT A TIME IS ACTIVE COMPANION SLOT
                nbc.wayPointControl.pausePlayer();
                console.warn("PRESENT QUEUE", nbc.wayPointControl.presentQueue);
                nbc.articlePage.checkEndGallery();
            }, {
                offset: '100%'
            });
        }
        jQuery('#article_' + currentQueue + '_elements h1.headline').waypoint(function(direction) {

            jQuery("#eyeDiv").detach();
            console.log('I GIVE YOU.... ADS!!');
            if (nbc.isMobile == "false") {
                nbcgptengine.buildAnAdSlot("#leaderboard1-" + currentQueue, "728,90", 1, "top", "", false);
                jQuery("#adBackgroundContainer").fadeOut("slow", function() {
                    jQuery('body').removeAttr('style');
                    jQuery(this).removeAttr('style');
                    nbcgptengine.buildAnAdSlot("#rect1-" + currentQueue, "300,250|300,600", 1, "top", "", false);
                    jQuery(this).fadeIn("slow");
                });

                if (currentQueue % 2 == 0) {
                    nbcgptengine.buildAnAdSlot("#rectSmall1-" + currentQueue, "300,160", 1, "top", "", false);
                }
                if (jQuery('#logo_ad_' + currentQueue).length > 0) {
                    nbcgptengine.buildAnAdSlot("#logo_ad_" + currentQueue, "88,31", 1, "top", "", false);
                }
                nbcgptengine.buildAnAdSlot("#rect2-" + currentQueue, "300,250", 1, "bottom", "", false);

            } else {
                nbcgptengine.buildAnAdSlot("#leaderboard1-" + currentQueue, "320,50", 1, "top", "", false);
                nbcgptengine.buildAnAdSlot("#article_" + currentQueue + "_ad_square", "300,250", 1, "top", "", false);
            }
        }, {
            offset: 'bottom-in-view',
            triggerOnce: true
        });
    },
    adSlotIds: [],
    liveVideoRefreshAds: function(queue) {
        var currentQueue = queue;
        var adSlotsToRefresh = ['leaderboard1-', 'rect1-', 'rectSmall1-', 'rect2-', 'logo_ad_'];
        nbc.wayPointControl.adSlotIds = [];
        jQuery.each(adSlotsToRefresh, function(index, value) {
            if (jQuery('#' + value + currentQueue + ' .adSlot').length > 0) {
                nbc.wayPointControl.adSlotIds.push(jQuery('#' + value + currentQueue + ' .adSlot').attr('id'));
            }
        });

        nbc.articlePage.intrvlLiveVideo = setInterval(function() {
            nbc.wayPointControl.intervalLiveVideoAdRefresh()
        }, 120000);
        nbc.wayPointControl.adRefreshInterval = true;
    },

    intervalLiveVideoAdRefresh: function() {
        jQuery.each(nbc.wayPointControl.adSlotIds, function(index, element) {
            nbcgptengine.slotRefresh(element)
        });
    },

    outbrainChecker: null,
    outbrainCount: 0,
    testOutbrain: function() {
        this.outbrainCount++;
        console.log('RUNNING CHECK', nbc.wayPointControl.queue);
        if (jQuery('#article-sec_' + nbc.wayPointControl.queue + ' .OUTBRAIN').text().length > 0) {
            clearInterval(this.outbrainChecker)
            jQuery.waypoints('refresh');
        }
        if (this.outbrainCount == 30) {
            clearInterval(this.outbrainChecker)
        }
    }
}


nbc.htmlTemplates.ParentTemplate = function() {
    this.headTemplate = [
        '<div id="article_{{count}}" class="article_elements {{articleType}} {{imageLayout}} scrollArticle">',
        '<article id="article_{{count}}_elements">',
        '<div id="article_{{count}}_headline_byline" class="headline_region">'
    ];
    this.embeddedModuleDefault = function(embedObject) {
        var embedType = "";
        switch (embedObject.template) {
            case "PHOTO":
                break
            case "Custom HTML Module":
                embedType = "embed";
                break
            case "Twitter Embed":
                embedType = "twitter";
                break
            case "EMBED - Facebook":
                embedType = "facebook";
                break
            case "EMBED - Interactive Radar":
                embedType = "interactive-radar";
                break
            case "EMBED - Vine":
                embedType = "vine";
                break
            case "EMBED - Instagram":
                embedType = "instagram";
                break
            case "EMBED - Google Plus":
                embedType = "googleplus";
                break
            case "EMBED - Google Maps":
                embedType = "gmaps";
                break
            default:
                break
        }
        if (embedObject.template == "PHOTO") {
            return '<div class="embedded cm photo" style="width:620px; height:auto;" data-cid="' + embedObject.id + '"><img width="620" height="349" src="' + embedObject.media_url + '"><div class="embeddedMediaCaption nested">' + embedObject.title + '</div><div class="embeddedMediaCredit nested" style="top:349px;display:none;">$!{embedItem.leftImage.credit}</div></div>';
        } else {
            return '<div class="embedded cm ' + embedType + '" data-network="' + embedType + '" data-cid="' + embedObject.id + '">' + embedObject.htmlCode + '</div>'
        }
    };
    this.wsiIframeBuilder = function(wsiInfo) {
        var mapCID = wsiInfo.split('js?cid=')[1].split('\"><\/script>')[0];
        var grabProperties = jQuery('<div />').html(wsiInfo).find('div').children()
        var thisMapTemplateID = grabProperties.attr('templateid');
        var thisMapID = grabProperties.attr('mapid');
        var thisMapLat = grabProperties.attr('latitude');
        var thisMapLong = grabProperties.attr('longitude');
        var thisMapLayers = grabProperties.attr('layers');
        var iframeQueryString = '?mapCID=' + mapCID + '&mapTemplateID=' + thisMapTemplateID + '&mapID=' + thisMapID + '&mapLat=' + thisMapLat + '&mapLong=' + thisMapLong + '&layers=' + thisMapLayers;
        if (nbc.isMobile === "true") {
            iframeQueryString += '&isMobile=true'
        }
        return iframeQueryString
    };
    this.bylineExtractor = function(author, market) {
        var bylineArray = [];
        var bylineString = '';
        var marketLink = "";

        function bylineBuilder(elem, index) {
            bylineArray[index] = '<a href="/results/?keywords=%22' + elem.replace(' ', '+') + '%22&byline=y&sort=date">' + elem + '</a>'
        };

        function bylineAssembly(elem, index) {
            if (index == (this.length - 1)) {
                bylineString += elem
            } else if (index < this.length - 2) {
                bylineString += elem + ", "
            } else {
                bylineString += elem + " and "
            }
        };
        captureArray = author.split(/ and | AND | & |; |, /);
        captureArray.forEach(bylineBuilder);
        bylineArray.forEach(bylineAssembly, bylineArray);

        if (market !== "") {
            switch (market) {
                case "PlPhi - PlanPhilly":
                    marketLink = " | <a href='http://www.PlanPhilly.org' target='_new'>PlanPhilly.org</a>";
                    break
                case "NWRK- Newsworks.org":
                    marketLink = " | <a href='http://www.Newsworks.org' target='_new'>Newsworks.org</a>";
                    break
                default:
                    break
            }
        }

        return "<h3 class='byline'>By " + bylineString + marketLink + "</h3>";
    }

};

nbc.typewriter = function(id) {
    this.id = id;
    this.instanceTime = new Date();
    this.requestedArticles = null;
    this.storyQueue = 0;
    this.template = {};
    this.init = function() {
        console.log("NBC OTS | TYPEWRITER | INSTANCE NAME: " + this.id);
        this.template = (nbc.isMobile === "true") ? new nbc.htmlTemplates.Mobile() : new nbc.htmlTemplates.Desktop();
        nbc.activeTypewriters.push(this.id);
        // remove current article from targetedArticles List
    }

    this._debugArticle = function() {
        if (location.origin.indexOf('http://dev.') != -1) {
            console.warn(this.requestedArticles);
        }
    }

    // Request article(s) from the CMS
    this.getArticles = function(cmsID) {
        var modeParam = (nbc.isMobile === "true") ? "&akmobile=o" : "";
        var requestTimeStamp = new Date();
        jQuery.ajax({
            // url : "/i/dispatcher/?h=article_metadata&cid=123456789",
            // Temporary call, will eventually go through the dispatcher.
            url: "/templates/nbc_article_redesign_handler?contentArray=" + cmsID + "&domain=" + nbc.domain + modeParam,
            context: this,
            dataType: "json",
            cache: false,

            success: function(data) {
                console.log("The articles have loaded!");
            },

            complete: function(data) {
                var trimArticleData = jQuery.trim(data.responseText);
                var tidyResponse = JSON.parse(trimArticleData);
                nbc.articlePage.ra = tidyResponse;
                this.buildArticle(nbc.articlePage.ra[0]);
            },

            error: function(data) {
                console.warn('something bombed');
            }

        });

    }

    this.buildArticle = function(data) {
        this.template.leadData = data.embedStoryMediaLead[0];
        nbc.articlePage.thisArticleID = nbc.gptParams.pageData.contentid = data.id;
        nbc.articlePage.thisAuthor = data.byline;
        nbc.articlePage.thisArticleSource = nbc.articlePage.thisArticleFeature = nbc.articlePage.thisArticleCreateDate = "";
        nbc.articlePage.thisArticleSponsor = "page not sponsored";
        nbc.articlePage.thisArticleCreateDate = data.contentCreationDate;
        nbc.articlePage.thisPageType = "article";
        nbc.gptParams.pageData.feature = "Uncategorized";
        nbc.gptParams.pageData.sponsor = "";
        nbc.articlePage.featureHeader = [];
        var paragraphs = [];
        var c, f;
        var leadMediaType = historyString = "";
        var lead_size = (data.leadSize.length > 0) ? data.leadSize.toLowerCase() : "medium";
        var showDateLine = (data.updatedDateStamp.length > 0) ? true : false;

        nbc.articlePage.currentURL = location.protocol + '//' + nbc.domain + '/' + nbc.section + '/' + nbc.subsection + '/' + data.targets[0].url;
        nbc.articlePage.currentTitle = data.title;
        nbc.articlePage.currentSummary = data.summary;

        function printElementAndIndex(elem, index) {
            jQuery.each(elem, function(key, val) {
                if (val.indexOf('documentcloud.org/embed/loader.js') === -1 && val !== "\r\n\r\n\r\n\r\n\r\n\r\n        \r\n\r\n\r\n\r\n\r\n\r\n\r\n") {
                    paragraphs.push('<p class="paragraph" data-pnum="' + key + '">' + val + '</p>');
                }
            });
        };
        data.count = nbc.wayPointControl.queue;
        data.section = nbc.section;
        data.subsection = nbc.subsection.replace('-', ' ');
        data.absURL = nbc.articlePage.currentURL;
        data.articleType = "";
        data.imageLayout = "";
        data.MediaThumbnailCredit = "";
        if (data.subsection == "national international") {
            data.section = "National &amp; International News";
            data.subsection = ""
        }

        // BREADCRUMB - SPONSORED
        var breadCrumbTemplate = this.template.breadCrumbTemplate(data.subsection, data.categorization.content_sources, data.byline, data.sales_pkg, data.featureCnt, data.blogHeader);


        nbc.articlePage.featureHeader = nbc.articlePage.featureHeader.join("\n");

        if (data.sales_pkg.hasOwnProperty('id')) {
            breadCrumbTemplate.unshift('<h2 class="sponsored">sponsored</h2><div class="tipLink"><a title="This content is made possible by our sponsor and does not necessarily reflect the views of NBC ' + nbc.cityName + '." class="tooltip"><span title="More">What\'s This?</span></a><p style="display: none;" class="tip">This content is made possible by our sponsor and does not necessarily reflect the views of NBC  ' + nbc.cityName + '.</p></div>');
            data.articleType = "sponsored";
            nbc.articlePage.thisArticleSponsor = data.sales_pkg.title;
            nbc.gptParams.pageData.sponsor = data.sales_pkg.sponsor;
            if (data.contentType == "Link") {
                data.absURL = data.linkOutURL;
            } else {
                data.absURL = location.protocol + '//' + nbc.domain + data.targetedPath + '/' + data.targets[0].url;
            }
        }

        // LEAD MEDIA   data.media  data.vid_in_lead_pos  data.embedStoryMediaLead
        var leadTemplate = this.template.leadTemplate(data.media, data.vid_in_lead_pos, data.embedStoryMediaLead, lead_size, data.updatedDateStamp, showDateLine);
        data.MediaThumbnail = leadTemplate.MediaThumbnail;
        data.mediaCaption = leadTemplate.mediaCaption;
        data.MediaThumbnailCredit = leadTemplate.MediaThumbnailCredit;
        if (nbc.isMobile === "false") {
            data.imageLayout = leadTemplate.imageLayout
        }
        leadMediaType = leadTemplate.mediaType;

        data.body.forEach(printElementAndIndex);
        if (data.hasOwnProperty('publishedDateStamp')) {
            if (data.publishedDateStamp.length > 0) {
                paragraphs.push('<div class="dateline bottom">' + data.publishedDateStamp + '</div>');
            }
        }
        if (nbc.articlePage.autoFooter !== "") {
            paragraphs.push(nbc.articlePage.autoFooter);
        }

        if (data.contentType == "Link" && data.tags.length > 0) {
            paragraphs.push('<p class="paragraph"><a href="' + data.linkOutURL + '" target="_blank">Get More at ' + data.tags + '</a></p>');
        } else if (data.contentType == "Link" && data.articleType == "sponsored") {
            paragraphs.push('<p class="paragraph"><a href="' + data.linkOutURL + '" target="_blank">Get More</a></p>');
        };
        if (data.categorization.content_sources !== "Uncategorized") {
            var category = nbc.articlePage.thisArticleSource = data.categorization.content_sources;
            if (nbc.isMobile !== "true") {
                if (category.indexOf(" - ") > -1) {
                    category = category.split(" - ")[1];
                    if (data.categorization.contributedToArticle == "Yes") {
                        var catMarket = data.categorization.markets;
                        if (catMarket == "Hartford") {
                            catMarket = "Connecticut"
                        } else if (catMarket == "Los Angeles") {
                            catMarket = "Southern California"
                        }
                        category += " / NBC " + catMarket;
                    }
                }
                paragraphs.push('<h5 class="copyright"> Copyright ' + category + '</h5>');
            }
        }
        if (data.categorization.features !== "Uncategorized") {
            nbc.articlePage.thisArticleFeature = nbc.gptParams.pageData.feature = data.categorization.features;
        }
        data.paragraphs = paragraphs.join("");

        console.warn(leadTemplate.leadTemplate);
        articleTemplate = this.template.headTemplate.concat(breadCrumbTemplate, this.template.topSocialTemplate(), leadTemplate.leadTemplate, this.template.bottomTemplate(lead_size, showDateLine)).join("\n");
        for (prpty in data) {
            f = new RegExp("{{" + prpty + "}}", "ig");
            c = (c || articleTemplate).replace(f, data[prpty]);
        }

        if (data.articleType == "sponsored" && nbc.articlePage.foundSponsorCtype == "Article" && data.contentType == "Article") {
            historyString = data.targetedPath + "/" + data.targets[0].url;
        } else if (data.articleType == "sponsored" && data.contentType == "Link" && data.linkOutURL.indexOf(nbc.host) > -1) {
            historyString = data.linkOutURL.replace(nbc.host, "").replace("www.", "").replace("http://", "");
        } else {
            historyString = nbc.path + "/" + data.targets[0].url;
        }

        this.appendArticle(c, historyString, data.title, leadMediaType, data.isSensitive);
    }

    this.appendArticle = function(content, history, title, leadMediaType, isSensitive) {
        this.template.topAd();
        if (nbc.articlePage.clonedHeader.length > 0) {
            if (jQuery(nbc.articlePage.clonedHeader).html().indexOf("invHeaderImage") > 0) {
                nbc.articlePage.invHeader = true;
            } else if (nbc.sectionType == "NBCBlog") {
                nbc.articlePage.blogHeader = true;
            }
        }
        if (nbc.articlePage.featureHeader.length > 0 && !nbc.articlePage.invHeader) {
            jQuery(nbc.articlePage.featureHeader).insertBefore("#contentTrigger");
        } else if (nbc.articlePage.clonedHeader && (nbc.articlePage.invHeader || nbc.articlePage.blogHeader)) {
            nbc.articlePage.clonedHeader.attr('id', '').insertBefore("#contentTrigger");
            jQuery('#leaderboard1-' + nbc.wayPointControl.queue).css("margin-bottom", "15px")
        }
        jQuery("<section/>", {
            "id": "article-sec_" + (nbc.wayPointControl.queue),
            "data-history": history,
            html: content
        }).insertBefore("#contentTrigger");

        OBR.extern.researchWidget();
        try {
            FB.XFBML.parse(document.getElementById('article-sec_' + nbc.wayPointControl.queue), function() {
                jQuery.waypoints('refresh');
            });
        } catch (e) {
            console.warn("Facebook is being Facebook (Line 213)");
        }
        jQuery("#article-sec_" + nbc.wayPointControl.queue + " .embedded.video").each(function() {
            var thisID = jQuery(this).attr('id');
            var convertedID = thisID + '-' + nbc.wayPointControl.queue;
            jQuery(this).attr('id', convertedID);
            if (nbc.isMobile === "false") {
                jQuery('#' + convertedID).click(function() {
                    nbc.wayPointControl.eventListenerPausePlayer(nbc.wayPointControl.queue, convertedID)
                })
            }
            console.log(jQuery(this).attr('id'))
        });

        nbc.articlePage.currentURL = location.protocol + '//' + nbc.domain + history;
        this.template.activateModules(leadMediaType, this.template.leadData);

        if (isSensitive === "false") {
            nbc.wayPointControl.cScrollTurnOnAds(nbc.wayPointControl.queue);
        }

        nbc.articlePage.ra.splice(0, 1);
        if (nbc.isMobile === "false" || (nbc.isMobile === "true" && (nbc.articlePage.targetedArticles.length == 0 && nbc.articlePage.ra.length == 0))) {
            jQuery('#loader').hide();
        }
        console.log('append + history fired');
        //OMNITURE
        nbc.articleInlinkTracking(nbc.wayPointControl.queue);
        nbc.wayPointControl.omnitureTrigger(nbc.wayPointControl.queue, history);
        if (nbc.wayPointControl.queue == 3) {
            nbc.wayPointControl.upArrowControls();
        }
        if (nbc.articlePage.targetedArticles.length > 0 || nbc.articlePage.ra.length > 0) {
            nbc.wayPointControl.contentTrigger.waypoint(nbc.wayPointControl.offsetOptions);
            if (!nbc.wayPointControl.prevStoryNode) {
                nbc.wayPointControl.historyTriggers(0);
                nbc.wayPointControl.prevStoryNode = true;
                if (nbcVideoPageUtils.liveVideoAdRefreshActive) {
                    clearInterval(nbcVideoPageUtils.liveVideoAdRefresh);
                    nbcVideoPageUtils.liveVideoAdRefreshActive = false;
                }
            }

            nbc.wayPointControl.historyTriggers(nbc.wayPointControl.queue);
            jQuery.waypoints('refresh');
        } else {
            nbc.wayPointControl.historyTriggers(nbc.wayPointControl.queue);
            clearInterval(nbc.wayPointControl.refreshWaypoints);
            jQuery("#footer").show();
            if (getThePartnerCookie("partnerCookie") == "xfinity" && nbc.isMobile === "false") {
                jQuery('<style type="text/css">.cScroll #xfinityNavBar_footer, .cScroll #nbc_xfinity_footer {display:block !important}</style>').appendTo('head');
            }
        }
    }

    // Initialize.
    this.init();
}

if (nbc.articlePage.continuousScroll) {
    nbc.articlePage.tw = new nbc.typewriter('nbc.articlePage.tw');
}

jQuery(document).ready(function() {
    if (nbc.articlePage.continuousScroll && (nbc.articleTools.ieVersion() !== 8)) {
        var arrayLimit = 14;
        jQuery(this).scrollTop(0);
        jQuery("#footer").hide();
        nbc.wayPointControl.refreshWaypoints = setInterval(function() {
            jQuery.waypoints('refresh')
        }, 1000);

        nbc.articlePage.clonedHeader = jQuery('.invBanner, .invHeader, .blog_header').clone();

        nbc.articlePage.newsletterID = jQuery('#newsletterBox-0').attr('data-nsHandlerKey');

        nbc.articlePage.autoFooter = (jQuery("#article_0_elements .articleAutoFooter p").length > 0) ? '<div class="articleAutoFooter"><p>' + jQuery("#article_0_elements .articleAutoFooter p").html() + "</div></p>" : "";

        nbc.wayPointControl.contentTrigger = jQuery('#contentTrigger');
        var locationArray = location.pathname.split("/");
        jQuery('#article-sec_0').attr('data-history', nbc.path + "/" + locationArray[locationArray.length - 1]);

        for (var i = 0; i < nbc.articlePage.targetedArticles.length; i++) {
            if (nbc.articlePage.targetedArticles[i] == nbc.articlePage.thisArticleID) {
                nbc.articlePage.targetedArticles.splice(i, 1);
            }
        }

        if (nbc.articlePage.targetedArticles.length > arrayLimit) {
            var elementsToSplice = nbc.articlePage.targetedArticles.length - arrayLimit;
            nbc.articlePage.targetedArticles.splice((nbc.articlePage.targetedArticles.length - elementsToSplice), elementsToSplice)
        };

        if (nbc.articlePage.targetedArticles.length > 0) {
            nbc.wayPointControl.contentTrigger.waypoint(function(direction) {
                nbc.wayPointControl.wayPointTrigger(direction)
            }, nbc.wayPointControl.offsetOptions);
            if (U.readCookie("cScrollInfo") == null) {
                var lastParagraph = jQuery("#article_0_elements .paragraph").last();
                lastParagraph.waypoint(function(direction) {
                    if (direction == "down") {
                        if (nbc.isMobile === "true") {
                            jQuery('#cScrollIndicatorRect').toggleClass('cScrollMinimized');
                        };
                        jQuery('#cScrollIndicatorRect').fadeIn(300, function() {
                            U.createCookie('cScrollInfo', 'seen', 3);
                        });
                    } else {
                        jQuery('#cScrollIndicatorRect').fadeOut(300);
                    }
                }, {
                    offset: '100%',
                    triggerOnce: true
                });
            }

        } else {
            jQuery("#footer").show();
        }

        jQuery(window).scroll(function() {
            if (jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height()) {
                if (nbc.articlePage.targetedArticles.length > 0 && nbc.articlePage.continuousScroll) {
                    jQuery.waypoints('refresh');
                }
            }
        });

        jQuery('#upwardScrollArrow').click(function() {
            jQuery("html, body").animate({
                scrollTop: 0
            }, 1000);
        })
        if (nbc.isMobile === "false") {
            jQuery('#header').waypoint(function(direction) {
                nbc.wayPointControl.absoluteNav(direction)
            }, nbc.wayPointControl.offsetNavHeader);

            jQuery("#stickyNav .searchButton").click(function() {
                jQuery("#stickyNav .search-field-bg, #stickyForm, #stickyNav .stickySearchCancel").show();
                jQuery("#stickyNav .search-field-bg").animate({
                    width: "239px"
                }, 200);
                jQuery("#stickyNav ul").hide();
            });
            jQuery("#stickyNav .stickySearchCancel").click(function(e) {
                jQuery("#stickyForm, #stickyNav .stickySearchCancel").hide();
                jQuery("#stickyNav .search-field-bg").animate({
                    width: "0px"
                }, 200, function() {
                    jQuery("#stickyNav .search-field-bg").hide();
                });
                jQuery("#stickyNav ul").show();
            });
            if (getThePartnerCookie("partnerCookie") == "xfinity") {
                jQuery('body').addClass('cScroll');
                jQuery('#stickyNav, #xfinityNavBar, #nbc_xfinity_footer').addClass('cScroll_xfinity');
            }
            if (jQuery('#leadVideo0').length > 0) {
                nbc.wayPointControl.eventListenerPausePlayer(0)
            }
            jQuery("#article-sec_0 .embedded.video").each(function() {
                var thisID = jQuery(this).attr('id');

                jQuery('#' + thisID).click(function() {
                    nbc.wayPointControl.eventListenerPausePlayer(nbc.wayPointControl.queue, thisID)
                })
                console.log(jQuery(this).attr('id'))
            });
        } else {
            jQuery('#loader').show();
        }
    }
    if (nbc.isMobile === "true") {
        nbc.articleTools.resizeIframe('youtube.com', '300x169');
        nbc.shareControls.mobileSetUp(nbc.wayPointControl.queue);
    } else {
        nbc.wayPointControl.desktopCompanionActivation(nbc.wayPointControl.queue);
    }
    if (typeof nbc.articleInlinkTracking === "function") {
        nbc.articleInlinkTracking(nbc.wayPointControl.queue);
    }
});