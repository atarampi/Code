/*
 * 
 * 
3/11 companion activation
version 34
 * 
 */

nbc.updatePrintCall = function(me) {
    var urlContext = jQuery(me).parents("section").data("history");
    if (typeof urlContext !== "undefined") {
        clickTitle = jQuery(me).parents('section').find('h1.headline').text();
        clickURL = location.protocol + '//' + nbc.domain + urlContext;
        commonLoc = "&fb=Y&url=" + encodeURIComponent(getClickURL()) + "&title=" + encodeURIComponent(getClickTitle()) + "&random=" + Math.random() + "&partnerID=" + partnerID + "&cid=" + trkcid + "&expire=" + encodeURIComponent(getClickExpire());
        nbcu.prop55 = (jQuery(me).parents(".socialNetworks").attr('class').indexOf('bottom') > -1) ? "article interactions bottom" : "article interactions top";
        nbcu.prop53 = (jQuery(me).attr('class') == "printArticle") ? "print" : "email";
        nbcu.prop52 = nbcu.eVar53;
        nbcu.prop54 = nbcu.eVar53 + "|" + nbcu.prop53;
        nbcu.tl();
    }
}

nbc.weatherModuleUpdate = {
    loadModule: function(currentStory) {
        if (U.readCookie("zipCode")) {
            weatherZipCode = U.readCookie("zipCode");
        }
        var dataString = "h=weather_home_widget&zipCode=" + weatherZipCode;
        var urlpost = '/i/dispatcher/';

        jQuery.ajax({
            type: "GET",
            url: urlpost,
            data: dataString,
            cache: false,
            dataType: "html",
            success: function(data) {
                trimdata = jQuery.trim(data);
                jQuery("#weather-module-data-" + currentStory).html(trimdata);
                if (jQuery("#weather-module-data-" + currentStory + " .changeLocation").length > 0) {
                    nbcWeatherChangeLoc.init("#weather-module-data-" + currentStory);
                };
                if (nbc.market == "nbcphiladelphia") {
                    jQuery("#weather-module-data-" + currentStory + " #weather_ad_0").attr('id', 'weather_ad_' + currentStory)
                    nbcgptengine.buildAnAdSlot("#weather_ad_" + currentStory, "88,31", 1, "top", "weather", false);
                }
                nbc.weatherModuleUpdate.activateTracking(currentStory);
                jQuery("#processingWeatherLoading").hide();
            }
        });
    },
    activateTracking: function(currentStory) {
        jQuery('#weather-module-data-' + currentStory + ' .weather-module-wrapper a').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var omniTrack = jQuery(this).data('tracking');
            nbcu.linkTrackVars = "eVar7";
            nbcu.eVar7 = 'weather-rightrail|' + omniTrack;
            nbcu.tl(this, 'o', nbcu.eVar7, null, 'navigate');
        })
    }
}

nbc.htmlTemplates = {}

nbc.htmlTemplates.Desktop = function() {
    var instance = new nbc.htmlTemplates.ParentTemplate;
    var newsletterMessage = (nbc.subsection !== "") ? nbc.subsection : nbc.section;
    instance.imgProperties = function(leadImgSize) {
        switch (leadImgSize) {
            case "large":
                var sizeDimension = "971*546";
                var sizeClass = "large";
                break
            case "medium":
                var sizeDimension = "620*465";
                var sizeClass = "medium";
                break
            case "small":
                var sizeDimension = "320*180";
                var sizeClass = "small";
                break
            default:
                var sizeDimension = "485*273";
                var sizeClass = "medium";
                break
        }
        return {
            "sizeDimension": sizeDimension,
            "sizeClass": sizeClass
        }
    };

    instance.topAd = function() {
        jQuery('<div id="leaderboard1-' + nbc.wayPointControl.queue + '" class="cScroll ad"></div>').insertBefore("#contentTrigger");
        return
    };

    instance.rightRail = [
        '<div class="article rightrail"><span id="tp-ad-slot_300x250-{{count}}" class="freewheelRightRail"><form id="_fw_form_tp-ad-slot_300x250-{{count}}" style="display:none"><input type="hidden" name="_fw_input_tp-ad-slot_300x250-{{count}}" id="_fw_input_tp-ad-slot_300x250-{{count}}" value="w=300&h=250&envp=g_js"></form><span id="_fw_container_tp-ad-slot_300x250-{{count}}" class="_fwac"></span></span><div id="rect1-{{count}}" class="rail adunit rect1" data-size="300x250"></div>',
        '<div class="rail topstories"><h3 class="rightrail title" id="storyListHeader-{{count}}"></h3><div class="blackdivider1"></div><ul id="storyList-{{count}}"></ul></div>',
        '<div id="weatherMod-{{count}}" class="rail weatherbug" style="margin: 25px 0;"><div class="top-stories-weather" ><div class="weather-module"><div id="weather-module-data-{{count}}"><div id="processingWeatherLoading"><img alt="processing..." src="' + nbc.mediaDomain + '/designimages/nbc-ajax-loader.gif"/></div></div></div></div></div>',
        '<div id="rectSmall1-{{count}}" class="rail adunit rect2" data-size="300x160"></div>',
        '<div class="newsletterSignupBox"><div class="nsBox"><h3 class="rightrail title">NEWSLETTERS</h3><div class="icon envelope"></div><div class="blackdivider1"></div><h3 class="newsletter copy">Receive the latest ' + newsletterMessage + ' updates in your inbox</h3><form method="post" id="newsletterBox-{{count}}" class="nsForm validate" name="ns-subscribe-form" target="_blank"><fieldset><input class="required nsEmail" name="EMAIL" type="text" value="" onfocus="nsu.clearSignup(this)" /><input class="nsSubscribe" name="subscribe" type="submit" value="SIGN UP" /></fieldset></form></div><div class="nsFooter"><a href="http://' + nbc.domain + '/privacy/" name="&lpos=Newsletter Sign Up&lid=Privacy Policy">Privacy Policy</a> | <a href="http://' + nbc.domain + '/newsletters/" name="&lpos=Newsletter Sign Up&lid=More Newsletters">More Newsletters</a></div></div>',
        '<div id="rect2-{{count}}" class="rail adunit rect1" data-size="300x250"></div></div>'
    ]

    instance.leadGallery = function(embedStoryMediaLead) {
        var galleryArray = [
            '<div class="leadMediaRegion" style="height:530px;"><div id="leadGallery-{{count}}"><div id="gptAdMarkupForGallery-{{count}}" style="display: none"><div id="nbcad_300x250_iframe_gallery-{{count}}" class="adSlot" data-sizes="300,250" data-ord="2" data-pos="bottom" data-module="" style="width: 300px; height: 250px;"></div></div>',
            '<div class="pg_article"><div class="pg_article_header"><h1></h1><button type="button" class="pg_article_share_button"><img src="' + nbc.mediaDomain + '/designimages/share-arrow-light.png"> <span>Share</span></button><div class="gallery_landing_share"><span class="gallery_landing_share_triangle"></span>',
            '<ul class="socialTools"><li id="tweetBtnMain-{{count}}" class="twitter"></li><li id="facebookBtnMain-{{count}}" class="fbRecommend"></li><li id="gplusBtnMain-{{count}}" class="gplus"></li></ul>',
            '</div><button class="doClose">x</button></div><div class="pg_article_viewport_container"><div class="pgSponsored">Sponsored</div><div class="interstitial"><div class="doInterClose"><a href="#" onclick="$(\'.interstitial\').hide();"></a></div><h3>YOU MAY ALSO BE INTERESTED IN...</h3><div class="interstContent"><ul></ul></div></div><div class="pg_article_viewport"><ul><li style="height: 357px; width: 634px; display:none"><div id="nbc_videoplayer_iframeA1-{{count}}" class="prerollVideoClass"></div></li></ul></div><div class="pg_article_nav_old"><a href="#" class="goLeft" name="&lpos=previousphoto&lid=' + embedStoryMediaLead.title + '"><div class="leftNav"></div><div class="leftNav_under"></div></a><a href="#" class="goRight" name="&lpos=nextphoto&lid=' + embedStoryMediaLead.title + '" ><div class="rightNav"></div><div class="rightNav_under"></div></a></div><div class="pg_article_footer"><div class="pg_article_footer_tools"><div class="pg_article_autoplay">',
            '</div><div class="pg_article_counts"><span class="pg_article_counts_current">1</span> of <span class="pg_article_counts_total"></span></div><div class="pg_article_credit">&nbsp;</div><div class="pg_article_caption"></div></div><div class="pg_article_thumbnail_nav"><a href="#" class="thumbsLeft"><div class="leftThumbsNav"></div></a><div class="pg_article_thumbnails"><div class="pg_article_thumbnails_container"></div></div><a href="#" class="thumbsRight"><div class="rightThumbsNav"></div></a></div></div></div></div></div></div>'
        ]

        if (nbc.market == "nbcsandiego" || nbc.market == "nbcphiladelphia") {
            galleryArray.splice(4, 0, '<button type="button">View Gallery</button>');
        } else {
            galleryArray.splice(4, 0, '<button type="button">Play Gallery</button>');
        }

        return galleryArray
    }

    instance.compileEmbeds = function(embeds, leadImgSize, vid_in_lead_pos) {
        var embedArray = [];
        var embedVideoCount = 0;
        var imgProps = instance.imgProperties(leadImgSize);
        if (vid_in_lead_pos == "true") {
            embeds.splice(0, 1)
        }
        for (var i = 0; i < embeds.length; i++) {
            console.log(imgProps.sizeDimension, imgProps.sizeClass);
            if (i < 2) {
                switch (embeds[i].type) {
                    case "video":
                        var MediaThumbnail = nbc.mediaDomain + "/images/" + imgProps.sizeDimension + "/" + embeds[i].media_url.split('images/')[1];

                        embedArray[i] = '<div id="embeddedVideo' + nbc.wayPointControl.queue + embedVideoCount + '" class="embedded video" data-cid="' + embeds[i].id + '" ><h3 class="videoMediaTitle">' + embeds[i].title + '</h3><div class="videoPlayButton ' + imgProps.sizeClass + '"></div><div class="videoOverlay"></div><img alt="' + embeds[i].title + '" src="' + MediaThumbnail + '"></div>';
                        embedVideoCount++;
                        break
                    case "gallery":
                        var embedImage = nbc.mediaDomain + "/images/" + imgProps.sizeDimension + "/" + embeds[i].media_url.split('images/')[1];
                        embedArray[i] = '<div class="embedded gallery" data-cid="' + embeds[i].id + '" data-permloc="' + embeds[i].Url + '"><div class="galleryMask"><h3 class="largeTitle">' + embeds[i].title + '</h3><img alt="' + embeds[i].title + '" src="' + embedImage + '" width="100%"><div class="videoOverlay"></div></div><div class="icon gallery"></div></div>';
                        break
                    case "City Module":
                        embedArray[i] = instance.embeddedModuleDefault(embeds[i]);
                        break
                    case "Article":
                        embedArray[i] = '<div class="embedded article" data-cid="' + embeds[i].id + '"></div>';
                        break
                    case "Link":
                        embedArray[i] = '<div class="embedded pullquote" data-cid="' + embeds[i].id + '"><h3 class="quote">' + embeds[i].pullQuote + '</h3><h3 class="source">' + embeds[i].pullQuoteAttribute + '</h3><div class="clear"></div></div>';
                        break
                    default:
                        break
                }
            }
        }
        return embedArray;
    };

    instance.topSocialTemplate = function() {
        return ['<div class="socialNetworks"><div class="topShareLeft">',
            '<a href="#comments-{{count}}" class="viewComments">View Comments (<div class="fb-comments-count"><fb:comments-count href="{{absURL}}"></fb:comments-count></div>)</a> <div style="float:left;"> | </div>',
            '<div class="emailArticle" onmouseout="return(ETMouseOut());" onmouseover="return(ETMouseOver());" onclick="nbc.updatePrintCall(this);return(ET());">Email</div><div style="float:left;"> | </div><div class="printArticle" onmouseout="return(PTMouseOut());" onmouseover="return(PTMouseOver());" onclick="nbc.updatePrintCall(this);return(PT());">Print</div></div>',
            '<div class="topShareRight"><span class="twitter-share"><a href="http://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-url="{{absURL}}" data-text="{{title}}" data-via="' + nbc.twitterVia + '"></a></span><div class="fb-like" data-href="{{absURL}}" data-send="true" data-layout="button_count" data-width="160" data-show-faces="false" data-action="recommend" data-font="arial"></div><div class="google-plus"><div id="gplus-{{count}}"></div></div></div></div></div>']
    };
    instance.breadCrumbTemplate = function(data, market, author, sales_pkg, featureCnt, blogHeader) {
        var breadcrumb = new Array;
        if (sales_pkg.hasOwnProperty('id')) {
            breadcrumb[0] = ""
        } else {
            breadcrumb[0] = (data.length > 0) ? '<h3 class="breadcrumb section" itemprop="articleSection"> <a href="/' + nbc.section + '">{{section}}</a> </h3> <h3 class="breadcrumb subsection" itemprop="articleSection"> > <a href="/' + nbc.section + '/' + nbc.subsection + '">{{subsection}}</a></h3>' : '<h3 class="breadcrumb section"> <a href="/' + nbc.section + '">{{section}}</a></h3>';
        }
        breadcrumb[1] = '<h1 class="headline">{{title}}</h1><h2 class="subtitle">{{subtitle}}</h2>';
        if (nbc.path == "/news/new-england" && nbc.siteKey == "necn") {
            breadcrumb[1] = '<div class="necn_state"><span><a href="/connecticut" name="&lpos=New England State Nav&lid=Connecticut">Connecticut</a></span> <span>|</span> <span><a href="/maine" name="&lpos=New England State Nav&lid=Maine">Maine</a></span> <span>|</span> <span><a href="/massachusetts" name="&lpos=New England State Nav&lid=Massachusetts">Massachusetts</a></span> <span>|</span> <span><a href="/newhampshire" name="&lpos=New England State Nav&lid=New Hampshire">New Hampshire</a></span> <span>|</span> <span><a href="/rhodeisland" name="&lpos=New England State Nav&lid=Rhode Island">Rhode Island</a></span> <span>|</span> <span><a href="/vermont" name="&lpos=New England State Nav&lid=Vermont">Vermont</a></span></div>' + breadcrumb[1];
        }
        if (author !== "") {
            breadcrumb[1] += instance.bylineExtractor(author, market)
        }
        if (featureCnt.hasOwnProperty('featureRibbonImgUse') && nbc.sectionType !== "NBCBlog") {
            var headerBannerCss = "";
            var headerTitleTextCss = "";
            var headerBannerH2SpanCss = "";
            nbc.articlePage.featureHeader[0] = '<div id="feature-header-' + nbc.wayPointControl.queue + '" class="feature-header-container" style="margin-top: 10px;"><div class="feature_header" style="position:relative;"><div class="featureTopLeft"><div class="featureIdGraphic">';
            if ((featureCnt.featureRibbonImgUse !== "false") && (featureCnt.featureFilename.length > 0)) {
                nbc.articlePage.featureHeader[1] = '<a href="' + featureCnt.featureURL + '"><img src="' + nbc.mediaDomain + '/images/' + featureCnt.featureFilename + '" alt="' + featureCnt.featureTitle + '" /></a><span class="nocss"><h1>' + featureCnt.featureTitle + '</h1></span>'
            } else {
                nbc.articlePage.featureHeader[1] = '<a href="' + featureCnt.featureURL + '" class="headerTitleText"><h1>' + featureCnt.featureTitle + '</h1></a>'
            };

            nbc.articlePage.featureHeader[2] = '</div></div><div id="featureTopRight_' + nbc.wayPointControl.queue + '"><div id="logo_ad_' + nbc.wayPointControl.queue + '"></div></div></div>';

            if (featureCnt.featureRibbonHide === "false") {
                nbc.articlePage.featureHeader[3] = '<div class="headerBannerContainer"><div class="headerBanner"><h2>' + featureCnt.featureSubTitle + '</h2></div></div>'
            }

            nbc.articlePage.featureHeader.push('</div>');

            if (featureCnt.featureRibbonBg.length > 0) {
                var featureRibbonBgCSS = '#' + featureCnt.featureRibbonBg;
                headerBannerCss += 'background-color:' + featureRibbonBgCSS + ';';
                headerTitleTextCss += 'color:' + featureRibbonBgCSS + ';';
            }

            if (featureCnt.featureRibbonBottomGradient.length > 0) {
                var featureRibbonBtmGrdnt = '#' + featureCnt.featureRibbonBottomGradient;
                var featureRibbonTopGrdnt = '#' + featureCnt.featureRibbonTopGradient;
                headerBannerCss += 'background-image: linear-gradient(bottom, ' + featureRibbonBtmGrdnt + ' 25%, ' + featureRibbonTopGrdnt + ' 75%);background-image: -o-linear-gradient(bottom, ' + featureRibbonBtmGrdnt + ' 25%, ' + featureRibbonTopGrdnt + ' 75%);background-image: -moz-linear-gradient(bottom, ' + featureRibbonBtmGrdnt + ' 25%, ' + featureRibbonTopGrdnt + ' 75%);background-image: -webkit-linear-gradient(bottom, ' + featureRibbonBtmGrdnt + ' 25%, ' + featureRibbonTopGrdnt + ' 75%);background-image: -ms-linear-gradient(bottom, ' + featureRibbonBtmGrdnt + ' 25%, ' + featureRibbonTopGrdnt + ' 75%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.25, ' + featureRibbonBtmGrdnt + '),color-stop(0.75, ' + featureRibbonTopGrdnt + '));'
            }

            if (featureCnt.featureRibbonTopStroke.length > 0) {
                headerBannerH2SpanCss += 'border-bottom:1px solid #' + featureCnt.featureCntBtmStroke + ';border-top:1px solid #' + featureCnt.featureRibbonTopStroke + ';'
            }

            jQuery('<style type="text/css">#feature-header-' + nbc.wayPointControl.queue + ' .headerBanner {' + headerBannerCss + '} #feature-header-' + nbc.wayPointControl.queue + ' .feature_header .headerTitleText {' + headerTitleTextCss + '}#feature-header-' + nbc.wayPointControl.queue + ' .headerBanner span, #feature-header-' + nbc.wayPointControl.queue + ' .headerBanner h2 {' + headerBannerH2SpanCss + '}</style>').appendTo('head');

        } else if (blogHeader.hasOwnProperty('blogURL')) {
            var headerBannerCss = "";
            var headerBannerH2SpanCss = "";
            var blogimgHeight = 'height:' + blogHeader.blogImgHeight;
            if (blogHeader.blogBtmGrdnt.length > 0) {
                var blogRibbonBtmGrdnt = '#' + blogHeader.blogBtmGrdnt;
                var blogRibbonTopGrdnt = '#' + blogHeader.blogTopGrdnt;
                headerBannerCss += 'background-image: linear-gradient(bottom, ' + blogRibbonBtmGrdnt + ' 25%, ' + blogRibbonTopGrdnt + ' 75%);background-image: -o-linear-gradient(bottom, ' + blogRibbonBtmGrdnt + ' 25%, ' + blogRibbonTopGrdnt + ' 75%);background-image: -moz-linear-gradient(bottom, ' + blogRibbonBtmGrdnt + ' 25%, ' + blogRibbonTopGrdnt + ' 75%);background-image: -webkit-linear-gradient(bottom, ' + blogRibbonBtmGrdnt + ' 25%, ' + blogRibbonTopGrdnt + ' 75%);background-image: -ms-linear-gradient(bottom, ' + blogRibbonBtmGrdnt + ' 25%, ' + blogRibbonTopGrdnt + ' 75%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.25, ' + blogRibbonBtmGrdnt + '),color-stop(0.75, ' + blogRibbonTopGrdnt + '));'
            }

            if (blogHeader.blogTopStroke.length > 0) {
                headerBannerH2SpanCss += 'border-bottom:1px solid #' + blogHeader.blogBottomStroke + ';border-top:1px solid #' + blogHeader.blogTopStroke + ';'
            }

            nbc.articlePage.featureHeader[0] = '<div id="blog_header_' + nbc.wayPointControl.queue + '" class="blog_header" style="position:relative;' + blogimgHeight + '"><div class="blogIdGraphic"><a href="' + blogHeader.blogURL + '"><img src="' + nbc.mediaDomain + '/designimages/' + blogHeader.blogFilename + '" alt="' + blogHeader.blogTitle + '" /></a></div><div class="logo_ad_' + nbc.wayPointControl.queue + '"></div><div class="headerBannerContainer"><div class="headerBanner"><span>' + blogHeader.blogSubTitle + '</span></div></div></div>';

            jQuery('<style type="text/css">#blog_header_' + nbc.wayPointControl.queue + ' .headerBanner {' + headerBannerCss + '}#blog_header_' + nbc.wayPointControl.queue + '.headerBanner span, #blog_header_' + nbc.wayPointControl.queue + ' .headerBanner h2 {' + headerBannerH2SpanCss + '}</style>').appendTo('head');
        }
        return breadcrumb
    };

    instance.dateline = '<div class="dateline">{{updatedDateStamp}}</div>';
    instance.bottomTemplate = function(leadImgSize, showDateLine) {
        var bottomArray = [
            '<div class="articleText">{{paragraphs}}<div id="article_{{count}}_outbrain_top" data-widget-id="AR_3" data-src="{{absURL}}" class="OUTBRAIN" data-ob-template="NBCLocal"></div><div id="article_{{count}}_outbrain_bot" data-widget-id="AR_4" data-src="{{absURL}}" class="OUTBRAIN" data-ob-template="NBCLocal"></div></div>',
            '</article><aside><div class="socialNetworks bottom"><div class="topShareLeft"><a href="#comments-{{count}}" class="viewComments">View Comments (<div class="fb-comments-count"><fb:comments-count href="{{absURL}}"></fb:comments-count></div>)</a> <div style="float:left;"> | </div><div class="emailArticle" onmouseout="return(ETMouseOut());" onmouseover="return(ETMouseOver());" onclick="nbc.updatePrintCall(this);return(ET());">Email</div><div style="float:left;"> | </div><div class="printArticle" onmouseout="return(PTMouseOut());" onmouseover="return(PTMouseOver());" onclick="nbc.updatePrintCall(this);return(PT());">Print</div></div></div><div class="article-comments" itemprop="comment"><a name="comments-{{count}}"><span class="article-comments-header">Leave Comments</span></a><div class="fb-comments" data-href="{{absURL}}" data-num-posts="6" data-width="664" style="clear:both;"></div></div><div id="leaderboard2-{{count}}" class="ad"></div></aside><br clear="all"></div>'
        ];
        if (leadImgSize !== "small" && showDateLine) {
            bottomArray.unshift(instance.dateline)
        }
        if (leadImgSize === "large") {
            bottomArray.splice(2, 0, instance.rightRail.join("\n"));
        }
        return bottomArray;
    };

    instance.leadTemplate = function(media, vid_in_lead_pos, embedStoryMediaLead, leadImgSize, showDateLine) {
        if (embedStoryMediaLead.length > 0) {
            if (vid_in_lead_pos == "true" && leadImgSize == "small" || (embedStoryMediaLead[0].type == "gallery" && leadImgSize == "large")) {
                leadImgSize = "medium"
            }
        }
        var leadTemplate = new Array;
        var leadMediaType = "";
        var noImageModifier = (nbc.market == "necn") ? "necn-" : "";
        var imgProps = instance.imgProperties(leadImgSize);

        if (media.hasOwnProperty('media_url')) {
            var img = media.media_url;
            var mediaCaption = "";
            var MediaThumbnailCredit = "";
            leadTemplate[0] = '<div class="leadMediaRegion"><div class="leadMediaThumbnail image"><img width="100%" alt="{{title}}" src="{{MediaThumbnail}}">{{MediaThumbnailCredit}}</div></div>'

            if (vid_in_lead_pos == "true" && typeof embedStoryMediaLead[0] !== "undefined") {
                img = embedStoryMediaLead[0].media_url;
                var leadMediaType = embedStoryMediaLead[0].type;
                if (leadMediaType == "video" || leadMediaType == "live_video") {
                    if (leadMediaType == "live_video" && embedStoryMediaLead[0].liveVidEmbed !== "") {
                        leadTemplate[0] = '<div class="leadMediaRegion ' + embedStoryMediaLead[0].type + '"><div id="externalEmbed{{count}}" class="leadMediaThumbnail video">' + embedStoryMediaLead[0].liveVidEmbed + '</div></div>';
                    } else {
                        leadTemplate[0] = '<div class="leadMediaRegion ' + embedStoryMediaLead[0].type + '"><div id="endcard-{{count}}" class="endcardCS" style="display:none;"><div class="backplateCS"></div><div class="topRegionCS"><div class="backplateTopCS"></div><div class="items"><p class="videoTitle">' + embedStoryMediaLead[0].title + '</p><ul class="socialToolsCS"><li class="endcardShareBtnsCS"></li></ul><ul class="additionalShareCS"><li class="shareLink"><span>Link</span></li><li class="shareEmbed"><span>Embed</span></li><li class="shareEmail"><span onclick="nbc.updatePrintCall(this);return(ET());">Email</span></li></ul></div></div><div class="shareBoxes"><div class="linkBox" style="visibility:hidden;"><div class="boxCopy boxBtn"><span>Copy</span></div><div class="boxClose boxBtn"><span>Close</span></div><p class="boxLabel">Link to this video</p><form action="#"><fieldset><textarea rows="1" cols="2" readonly="readonly">' + embedStoryMediaLead[0].Url + '</textarea></fieldset></form></div><div class="embedBox" style="visibility:hidden;"><div class="boxCopy boxBtn"><span>Copy</span></div><div class="boxClose boxBtn"><span>Close</span></div><p class="boxLabel">Embed this video</p><form action="#"><fieldset><textarea rows="1" cols="2" readonly="readonly"><script type="text/javascript" charset="UTF-8" src="http://' + nbc.domain + '/portableplayer/?cmsID=' + embedStoryMediaLead[0].id + '&origin=' + nbc.host + '&sec=' + nbc.section + '&subsec=' + nbc.subsection + '&width=600&height=360"></script></textarea></fieldset></form></div></div><p class="replayButton"><a href="#" onclick="nbcVideoPageUtils.videoReplay();return false;">Replay</a></p><div class="bottomRegionCS"><div class="backplateBottomCS"></div><div class="items"><p class="related">More videos (1 of 9)</p><div class="relatedVideos"><ul class="videoBox"></ul></div><span class="pager prev">&laquo;</span><span class="pager next">&raquo;</span></div></div></div>' + '<div id="leadVideo{{count}}" data-cScroll="true" class="leadMediaThumbnail video" data-cid="' + embedStoryMediaLead[0].id + '" data-title="' + embedStoryMediaLead[0].title + '"><div class="videoPlayButton {{imageLayout}}"></div><h3 class="leadMediaTitle">' + embedStoryMediaLead[0].title + '</h3><div class="videoOverlay"></div><img src="{{MediaThumbnail}}" width="100%"></div></div>'
                    }
                } else if (leadMediaType == "gallery") {
                    leadTemplate[0] = instance.leadGallery(embedStoryMediaLead[0]).join("\n")
                } else if (leadMediaType == "Iframe Wrapper Embed") {
                    var embedIframeHeight = 'height:367px !important';
                    var embedIframeScroll = 'yes';
                    if (embedStoryMediaLead[0].height.length > 0) {
                        embedIframeHeight = 'height:' + embedStoryMediaLead[0].height + 'px !important';
                    }
                    if (embedStoryMediaLead[0].scrollSwitch == "false") {
                        embedIframeScroll = 'no';
                    }
                    if (embedStoryMediaLead[0].iframeHasContentDesktop == "true") {
                        leadTemplate[0] = '<div class="leadMediaRegion iframeEmbed"><iframe src="' + embedStoryMediaLead[0].iframeSrc + '" width="100%" style="' + embedIframeHeight + '" scrolling="' + embedIframeScroll + '" frameborder="0" name="iframeLeadEmbed"></iframe></div>';
                    }
                } else if (leadMediaType == "City Module") {
                    if (embedStoryMediaLead[0].htmlCode.indexOf('widgets.wsi.com/1.1/wx.loader.min.js') > -1) {
                        var iframeQueryString = instance.wsiIframeBuilder(embedStoryMediaLead[0].htmlCode);
                        leadTemplate[0] = '<div class="leadMediaRegion city_module"><div class="leadMediaThumbnail cm" data-cid="' + embedStoryMediaLead[0].id + '"><iframe src="' + nbc.fullDomain + '/templates/nbc_wsiradar_iframe.html' + iframeQueryString + '" width="100%" style="height:520px !important" scrolling="no" frameborder="0" name="weatherRadariFrame-{{count}}"></iframe></div></div>'
                    } else {
                        leadTemplate[0] = '<div class="leadMediaRegion city_module"><div class="leadMediaThumbnail cm" data-cid="' + embedStoryMediaLead[0].id + '">' + embedStoryMediaLead[0].htmlCode + '</div></div>'
                    }
                }
            }
            var MediaThumbnail = (img.indexOf("no-image.gif") > -1) ? nbc.mediaDomain + "/images/" + imgProps.sizeDimension + "/" + noImageModifier + "no-image.gif" : nbc.mediaDomain + "/images/" + imgProps.sizeDimension + "/" + img.split('images/')[1];

            if (leadMediaType == "video" && embedStoryMediaLead[0].description.length > 0) {
                mediaCaption = embedStoryMediaLead[0].description;
                if (embedStoryMediaLead[0].videoModDate.length > 0) {
                    mediaCaption += " (Published " + embedStoryMediaLead[0].videoModDate + ")";
                }
                leadTemplate[1] = '<div class="leadMediaCaption">{{mediaCaption}}</div>'
            } else if (media.hasOwnProperty('media_caption')) {
                if (media.media_caption.length > 0) {
                    mediaCaption = media.media_caption;
                    leadTemplate[1] = '<div class="leadMediaCaption">{{mediaCaption}}</div>'
                }
            }
            if (media.hasOwnProperty('media_credit')) {
                if (media.media_credit.length > 0) {
                    MediaThumbnailCredit = '<div class="leadMediaCredit"><span>' + media.media_credit + '</span></div>';
                }
            }
        }
        if (leadImgSize === "small" && showDateLine) {
            leadTemplate.unshift(instance.dateline)
        }
        if (leadImgSize !== "large") {
            leadTemplate.unshift(instance.rightRail.join("\n"))
        }
        return {
            "leadTemplate": leadTemplate,
            "MediaThumbnail": MediaThumbnail,
            "mediaCaption": mediaCaption,
            "MediaThumbnailCredit": MediaThumbnailCredit,
            "imageLayout": imgProps.sizeClass,
            "mediaType": leadMediaType
        }
    };

    instance.checkEmbedGalleries = function() {
        var currentQueue = nbc.wayPointControl.queue;
        try {
            if (jQuery("#article-sec_" + nbc.wayPointControl.queue + " .embedded.gallery").length != 0) {
                jQuery("#article-sec_" + nbc.wayPointControl.queue + " span.embedded.gallery, #article-sec_" + nbc.wayPointControl.queue + " div.embedded.gallery").each(function(a, b) {
                    var thisA2GalleryID = "pgA2-" + nbc.wayPointControl.queue + "-" + a;
                    var thisA2GalleryTitle = jQuery(this).data("title");
                    var thisA2GalleryCID = parseInt($(this).data('cid'));
                    var thisA2GalleryURL = jQuery(this).data("permloc");
                    jQuery(this).attr("id", thisA2GalleryID);
                    thisA2GalleryTitle = thisA2GalleryTitle.replace('"', '&quot;');
                    jQuery("#" + thisA2GalleryID).click(function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if ($(this).find(".pg_article").length == 0) {
                            pg.init("#" + thisA2GalleryID, thisA2GalleryCID, thisA2GalleryURL, thisA2GalleryTitle, true, "a2", "", true, currentQueue);
                            return false;
                        }
                    });
                });
            }
        } catch (e) {
            console.warn(e)
        }
    };

    instance.activateModules = function(leadMediaType, data) {
        nbc.updateTopStories();
        var currentArticle = nbc.wayPointControl.queue;
        if (currentArticle % 2 == 0) {
            jQuery('#processingWeatherLoading').show();
            nbc.weatherModuleUpdate.loadModule(currentArticle);
        } else {
            jQuery('#weatherMod-' + currentArticle).hide();
        }
        jQuery('#newsletterBox-' + currentArticle).attr('data-nsHandlerKey', nbc.articlePage.newsletterID);
        jQuery('#newsletterBox-' + currentArticle + '.nsForm').submit(function() {
            var nsHandlerKey = jQuery(this).attr('data-nsHandlerKey');
            var capturedEmail = jQuery('#newsletterBox-' + currentArticle + ' .nsEmail').val();
            nsu.signUserUp(capturedEmail, nsHandlerKey, currentArticle);
            return false;
        });
        if (leadMediaType === "gallery") {
            nbc.articlePage.thisPageType = "article slideshow embed";
            pg.promoObj = null;
            var ad300x250Src = "<iframe id='nbcad_300x250_iframe_gallery" + nbc.wayPointControl.queue + "' src='http://iv.doubleclick.net/adi/${o_adParameters};!category=slideshow;$!{galleryParams}$!{adDcOptParam}$!{$contentIdParam}$!{adTileParam}sz=300x250$!{additionalSize};!category=refresh;refresh=true;" + (top.__nbcudigitaladops_dtparams || '') + "zc=" + nbc.weather.adZipCode + ";ord=" + randDARTNumber + "?'  width='300' height='250' frameborder='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>";
            pg.init("#leadGallery-" + nbc.wayPointControl.queue, data.id, data.Url, data.title, false, "articleScroll", ad300x250Src, true, nbc.wayPointControl.queue)

        }

        if (leadMediaType === "video" || leadMediaType == "live_video") {
            nbc.articlePage.thisPageType = "article video embed";
            nbc.wayPointControl.desktopVideoLead(nbc.wayPointControl.queue);
            nbc.wayPointControl.desktopCompanionActivation(nbc.wayPointControl.queue);
            if (leadMediaType == "live_video") {
                nbc.wayPointControl.liveVideoRefreshAds(nbc.wayPointControl.queue);
            }
        }

        //jQuery.ajax( {url : 'https://apis.google.com/js/plusone.js', dataType : 'script', cache : true} );
        twttr.widgets.load();
        gapi.plusone.render(
            'gplus-' + nbc.wayPointControl.queue, {
                "size": "medium",
                "href": nbc.articlePage.currentURL
            }
        );
        nbcVideoPageUtils.playScanner('#article-sec_' + nbc.wayPointControl.queue);
        nbc.articleTools.renderSocialEmbeds('article_' + nbc.wayPointControl.queue + '_elements');
        instance.checkEmbedGalleries();
        nbc.articlePage.checkEndGallery();
        jQuery('#article-sec_' + nbc.wayPointControl.queue + ' .viewComments').click(function() {
            nbcu.prop55 = (jQuery(this).parents(".socialNetworks").attr('class').indexOf('bottom') > -1) ? "article interactions bottom" : "article interactions top";
            nbcu.prop53 = "view comments";
            nbcu.prop52 = nbcu.eVar53;
            nbcu.prop54 = nbcu.eVar53 + "|" + nbcu.prop53;
            nbcu.tl();
        })
    }

    return instance;
}