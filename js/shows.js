/************************************************
 * Author: Robert Thayer - rthayer@alum.ups.edu *
 * Twitter: @WoWMonk                            *
 * Written for: Pat Krane - Signals Media       *
 * Using: Twitter Bootstrap, HTML5 Audio Player *
 ************************************************/


var showList = [], // Array to hold the Show objects
    index, // Used as a index variable for loops
    mainContentArea = document.getElementById("mainContentArea"), // <div> for placing the main content
    feedArea = document.getElementById("feedArea"); // <div> for placing the RSS feed
    
// Show object that holds info about a specific show
function Show(logo, audioFeed, title, hosts, description, twitter, facebook, twitch, youtube, website) {
    this.logo = logo; // URL for show image.
    this.audioFeed = audioFeed; // RSS feed for audio podcasts
    this.title = title; // Title of the show
    this.hosts = hosts; // Array of host names
    this.description = description; // Description of the show
    this.twitter = twitter; // Twitter handle for the show
    this.facebook = facebook; // Facebook page for the show
    this.twitch = twitch; // Twitch page for the show
    this.youtube = youtube; // YouTube page for the show.
    this.website = website; // Website of the show
    this.live = getLive(twitch); // Determine if their twitch channel is currently live
}

// Function to add show to the list
Show.prototype.pushShow = function () {
    showList.push(this);
};

// Function to display info page about a show
Show.prototype.display = function () {
    var banner = document.createElement("div"), // Top area with image and info
        container = document.createElement("div"), // Container for the info
        hosts; // String to display the Hosts of the show
        
    banner.className = "jumbotron";
    container.className = "container";
    
    // If the show doesn't have listed hosts, indicate that. If they do, loop and display the hosts in order with a line break
    if (!this.hosts) {
        hosts = "Not listed.";
    } else {
        hosts = "<br />";
        for (index = 0; index < this.hosts.length; index++) {
            hosts += this.hosts[index] + "<br />";
        } // end else
    } // end if
    
    // Place the logo (responsive), title, and hosts in the container
    container.innerHTML = "<center><img class='img-responsive' src=" + this.logo + "><br /><h1 id='showTitle'>" + this.title + "</h1></center><p>" + this.description + "</p><p><b>Hosts: </b>" + hosts;
    // Add container to the main jumbotron
    banner.appendChild(container);
    // Clear the main content and feed area
    mainContentArea.innerHTML = "";
    feedArea.innerHTML = "";
    // Add banner to the main area
    mainContentArea.appendChild(banner);
    // Add the Social media links to the page under the jumbotron
    displaySocial(this.twitter, this.facebook, this.youtube, this.twitch, this.website, this.live);
    // Take the RSS feed, parse it, and display (Initialize function on index.html)
    initialize(this.audioFeed);
};

// Helper function to determine if the browser is Chrome or Safari as they each treat media differently
function getBrowser()
{
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
        isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    if (isChrome) {
        return "chrome";
    } else if (isSafari) {
        return "safari";
    } else {
        return "other";
    }
}

// Take social media usernames and provide branded buttons
function displaySocial(twitter, facebook, youtube, twitch, website, live) {
    var container = document.createElement("div"), // content area for the buttons
        button, // reusable var for each button
        count = 0; // This is used to keep the last button from taking full length of screen if there is an odd number of links.
    container.className = "btn-group btn-group-justified btn-group-sm";
    container.setAttribute("role", "group");
    
    // Twitter button
    if (twitter !== null) {
        button = document.createElement("a");
        button.setAttribute("href", "http://www.twitter.com/" + twitter);
        button.innerHTML = "<i class='fa fa-twitter'></i> " + twitter;
        button.setAttribute("role", "button");
        button.className = "btn btn-block btn-social btn-sm btn-twitter";
        
        // Check if this is first button on row or 2nd.
        // If first, increment the count variable. If second, add row to content area, start a new row and reset count to 1
        if (count < 2) {
            container.appendChild(button);
            count++;
        } else {
            mainContentArea.appendChild(container);
            container = document.createElement("div");
            container.className = "btn-group btn-group-justified btn-group-sm";
            container.setAttribute("role", "group");
            container.appendChild(button);
            count = 1;
        }
    }
    
    // Web button
    if (website !== null) {
        button = document.createElement("a");
        button.setAttribute("href", website);
        button.innerHTML = "<i class='fa fa-link'></i> " + website.replace("http://www.", "");
        button.setAttribute('role', 'button');
        button.className = "btn btn-block btn-social btn-sm btn-reddit";
        
        // Check if this is first button on row or 2nd.
        // If first, increment the count variable. If second, add row to content area, start a new row and reset count to 1
        if (count < 2) {
            container.appendChild(button);
            count++;
        } else {
            mainContentArea.appendChild(container);
            container = document.createElement("div");
            container.className = "btn-group btn-group-justified btn-group-sm";
            container.setAttribute("role", "group");
            container.appendChild(button);
            count = 1;
        }
    }
    
    // YouTube button
    if (youtube !== null) {
        button = document.createElement("a");
        button.setAttribute("href", "http://www.youtube.com/user/" + youtube);
        button.innerHTML = "<i class='fa fa-youtube-play'></i> " + youtube;
        button.setAttribute('role', 'button');
        button.className = "btn btn-block btn-social btn-sm btn-youtube";
        
        // Check if this is first button on row or 2nd.
        // If first, increment the count variable. If second, add row to content area, start a new row and reset count to 1
        if (count < 2) {
            container.appendChild(button);
            count++;
        } else {
            mainContentArea.appendChild(container);
            container = document.createElement("div");
            container.className = "btn-group btn-group-justified btn-group-sm";
            container.setAttribute("role", "group");
            container.appendChild(button);
            count = 1;
        }
    }
    
    // Twitch.TV button
    if (twitch !== null) {
        var twitchButton = document.createElement("a");
        twitchButton.className = "btn btn-block btn-social btn-sm btn-twitch";
        twitchButton.setAttribute("href", "http://www.twitch.tv/" + twitch);
        
        // If their twitch channel is currently live, modify button to indicate that
        if (live === true) {
            twitchButton.innerHTML = "<i class='fa fa-twitch'></i> " + twitch + " <i class='fa fa-play'></i> Live Now";
        } else {
            twitchButton.innerHTML = "<i class='fa fa-twitch'></i> " + twitch;
        }
        twitchButton.setAttribute('role', 'button');
        
        // Check if this is first button on row or 2nd.
        // If first, increment the count variable. If second, add row to content area, start a new row and reset count to 1
        if (count < 2) {
            container.appendChild(twitchButton);
            count++;
        } else {
            mainContentArea.appendChild(container);
            container = document.createElement("div");
            container.className = "btn-group btn-group-justified btn-group-sm";
            container.setAttribute("role", "group");
            container.appendChild(twitchButton);
            count = 1;
        }
    }
    
    // Facebook button
    if (facebook !== null) {
        button = document.createElement("a");
        button.setAttribute("href", "http://www.facebook.com/" + facebook);
        button.innerHTML = "<i class='fa fa-facebook'></i> " + facebook;
        button.setAttribute('role', 'button');
        button.className = "btn btn-block btn-social btn-sm btn-facebook";
        
        // Check if this is first button on row or 2nd.
        // If first, increment the count variable. If second, add row to content area, start a new row and reset count to 1
        if (count < 2) {
            container.appendChild(button);
            count++;
        } else {
            mainContentArea.appendChild(container);
            container = document.createElement("div");
            container.className = "btn-group btn-group-justified btn-group-sm";
            container.setAttribute("role", "group");
            container.appendChild(button);
            count = 1;
        }
    }
    
    // After going through all social media, check to see if the final row has 1 button. If so, add a dummy blank button
    // to prevent the final button being full width.
    if (count === 1) {
        button = document.createElement("a");
        button.setAttribute("href", "#");
        button.setAttribute('role', 'button');
        button.className = "btn btn-block btn-sm";
        container.appendChild(button);
    }
    
    // Add social media buttons to the main area.
    mainContentArea.appendChild(container);
} 


// Main page function. Loop through shows in the list and display their logos in a grid
// Each logo will link to displaying that show's info
function displayShows() {
    var square,
        gridContent,
        table,
        tableCell;
    
    // Clear main page
    mainContentArea.innerHTML = "";
    feedArea.innerHTML = "";
    
    // Loop through shows and create grid
    for (index = 0; index < showList.length; index++) {
        square = document.createElement("div");
        square.className = "grid square";
        gridContent = document.createElement("div");
        gridContent.className = "grid gridContent";
        table = document.createElement("div");
        table.className = "grid gridTable";
        tableCell = document.createElement("div");
        tableCell.className = "grid gridTable-cell";
        tableCell.innerHTML = "<img src=" + showList[index].logo + " height='auto' width='100%' onclick='showList[" + index + "].display()'>";
        
        // Add the created show logo to the grid
        table.appendChild(tableCell);
        gridContent.appendChild(table);
        square.appendChild(gridContent);
        mainContentArea.appendChild(square);
    }
}

// Displays an About Us page
function displayAbout() {
    mainContentArea.innerHTML = '<div class="jumbotron"><div class="container"><p><a href="http://www.signalsmedia.com/wp-content/uploads/2012/08/logogreen540x250.jpg"><img class="img-responsive center-block" title="logogreen540x250" src="http://www.signalsmedia.com/wp-content/uploads/2012/08/logogreen540x250.jpg" alt="" width="541" height="250" /></a></p><p>Signals Media LLC was founded by Pat Krane in Minneapolis, Minnesota way back in 2003.  Before it was home to a podcasting network, this company was dedicated to churning out quality audio (and video) projects.  So really, nothing has changed!</p><p>Now, Pat has teamed up with some of his friends to make a network.  What does this mean?  More awesome content all in one place.  Take a listen to our wares and tell your friends!</p><p><span style="text-decoration: underline;"><strong>From Pat:</strong></span><br />Thank you for joining me and my friends on our podcasts: our cool stories, our trials and tribulations, and our terrible jokes.  And while you may be enjoying the podcasts, my favorite part of the whole thing is having great listeners to share them with, like you.</p><p>Welcome to our new community of podcasters and listeners.  I can&#8217;t wait to see where this goes from here.</p><p>Oh hey, if you need anything, like a voiceover, some cool music, podcasting help, or&#8230; whatever, please let me know.  If I can help, I&#8217;d be glad to.  And if and when you&#8217;re interested in any of those services, just get a hold of me and I&#8217;ll let you know my rates.  I&#8217;ll make sure to give you the &#8220;friend&#8221; prices, too.  <img src="http://www.signalsmedia.com/wp-includes/images/smilies/icon_wink.gif" alt=";)" /></p></div></div></div>';
    displaySocial("AllStarNetwork", null, null, null, null, false);
    feedArea.innerHTML = '';
}

// Use the Twitch.tv API to determine if the channel is live.
// Returns a boolean either true for live, false for not
function getLive(twitch) {
    if (twitch !== null) {
        $.ajax({
            url: "https://api.twitch.tv/kraken/streams/" + twitch,
            type: 'get',
            dataType: 'jsonp',
            success: function (data) {
                if (data.stream !== null) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }
}

// Enable to use Twitter Bootstrap timed (2 seconds) alert at the top of the screen
function setAlert(message, id, color) {
    var alert = document.createElement("div");
    if (color === 1) {
        alert.setAttribute("class", "alert alert-success fade");
    } else {
        alert.setAttribute("class", "alert alert-danger fade");
    }
    alert.setAttribute("role", "alert");
    alert.id = id;
    id = "#" + id;
    alert.innerHTML = message;
    document.getElementById("alerts").appendChild(alert);
    $(id).delay(200).addClass("in");
    setInterval(function () {$("#alerts").empty(); }, 10000);
}

// Take the audio link, show title, and show name and pass it to the audio player
function playEpisode(source, title, show) {
    document.getElementById("pcast-title").innerHTML = title;
    document.getElementById("pcast-ep").innerHTML = show;
    document.getElementById("podcastSource").setAttribute("src", source);
    document.getElementById("podcastLink").setAttribute("href", source);
    document.getElementById("podcastPlayer").classList.remove("hidden");
}


// Cleanses a URL variable.

function getQueryVariable(variable){
    try{
        q = location.search.substring(1);
        v = q.split("&");
        for( var i = 0; i < v.length; i++ ){
            p = v[i].split("=");
            if( p[0] == variable ){
                if( p[1].indexOf('%20') != -1 ){
                    return decodeURIComponent(p[1]);
                }
                else{
                    return p[1];
                }
            }
        }
    }
    catch (e){
        console.log(e);
    }
}

    
/*  =========================
    |   Show information    |
    ========================= */

// Create show objects
var convertToRaid = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/CtR-Cover-e1346187765417.png", // Icon
    "http://converttoraid.libsyn.com/rss", // Audio RSS
    "Convert to Raid", // Show title
    ["Pat Krane", "Koltrane", "Dairies"], // Hosts
    "Welcome home, raiders!  Join Zhug, Dairies and Koltrane each week for your latest WoW fix on Convert to Raid, the award winning weekly podcast for raiders in World of Warcraft.  This is your home to the latest news and views, boss strategies, player guides and discussion, and really bad jokes.  If it’s in the end game, it’s on Convert to Raid!", // Description
    "ConvertToRaid", // Twitter handle
    "converttoraid", // Facebook
    "gamebreakertv", // Twitch
    null, // YouTube
    "http://www.converttoraid.com" // Website
);
convertToRaid.pushShow();

var theConverted = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2014/08/squarelogo-e1407347385686.jpg",
    "http://convertedpodcast.com/?feed=rss2", // Audio RSS
    "The Converted Podcast",
    ["Belschnickle", "Sal", "Navox"],
    "The Converted is the podcast dedicated to the Convert to Raid Guild on Aerie Peak – US! Join Belshnickle, Sal, and Navox as they bring in great guests from around the community to talk about the latest in the World of Warcraft. Great people, amazing stories, and tons of fun!",
    "converted_CTR",
    //null,
    null,
    null,
    "ConvertedPodcast",
    "http://www.convertedpodcast.com"
);
theConverted.pushShow();

var deadFansTalking = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2014/08/Dead-Fans-Talking-Logo-e1407347478183.jpg", // Icon
    "http://www.deadfanstalking.com/feed/podcast/", // Audio RSS
    "Dead Fans Talking", // Title
    ["Mick Montgomery", "Wendy Maybury", "Jarret LeMaster"], // Hosts
    "Hosted by Mick Montgomery, Wendy Maybury and Jarret LeMaster, Dead Fans Talking is your one stop podcast for Walking Dead News, Comic Book Reviews and of course in depth break downs of the latest episode of The Walking Dead television series!", // Description
    "deadfanstalking", // Twitter
    "spazbotstudios", // Facebook
    "spazbotstudios", // Twitch
    "spazbotstudios", // YouTube
    "http://www.deadfanstalking.com"
);
deadFansTalking.pushShow();

var deathD4 = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/230860_162460077151699_6248271_n-e1346456225298.jpg", // Icon
    "http://feeds.feedburner.com/deathd4dishonor", // Audio RSS
    "Death D4 Dishonor", // Show title
    ["Tinzien"], // Hosts
    "Every week the international cast of the Death d4 Dishonor podcast delivers an exciting, entertaining, on-going theatre of the mind adventure set somewhere in the D&D 4e multiverse. Episodes are created and recorded on the fly by the cast with sometimes unpredictable results. Our DM Tinzien invites all to come listen and participate in our excellent podcast.", // Description
    "deathD4", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.deathd4dishonor.com" // Website
);
deathD4.pushShow();

var extendedM = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2015/01/extend1-e1421132528703.png", // Icon
    "http://realm-maintenance.com/category/realm-maintenance/em-podcast/feed/", // Audio RSS
    "Extended Maintenance", // Show title
    ["Alt", "Rho"], // Hosts
    "A semi-occasional World of Warcraft podcast covering a single discussion topic, featuring Alt from Alternative Chat and Rho from Realm Maintenance. When the topic is too big for them to talk about on their solo shows, you’ll hear them team up for Extended Maintenance!", // Description
    "extendedcast", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.extendedcast.net" // Website
);
extendedM.pushShow();

var fullcast = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/FCPClogo.jpeg", // Icon
    "http://www.fullcastpodcast.com/?feed=fullcastpodcast", // Audio RSS
    "The Fullcast Podcast", // Show title
    ["Bryan Lincoln", "Abigail Hilton"], // Hosts
    "The Fullcast Podcast is the award winning educational podcast about producing full cast audio books, with an emphasis on creative commons. Topics include world building, writing, editing, casting roles, recording techniques, voice acting, audio production, sound effects, music options, distribution, finding an audience, and dealing with feedback. Many of these topics are discussed along with guest producers, writers, and actors.", // Description
    "fullcastpodcast", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.fullcastpodcast.com" // Website
);
fullcast.pushShow();

var greyArea = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/greyarea-e1346456054127.jpg", // Icon
    "http://feeds.feedburner.com/TheUnimportantCrabshack", // Audio RSS
    "The Grey Area Podcast", // Show title
    ["Jenesee Grey"], // Hosts
    "The Grey Area Podcast features interviews with developers, gaming news and reviews with a focus on inter-relationships between gamers. Players of video games often have unique interactions with each other, this podcast explores the creativity and inspiration of developers, level designers, composers and other game related experts. It also has a secondary focus on women and the role they play in the evolution of the society of gaming as we become more even in our gender balance.", // Description
    "greyareapodcast", // Twitter handle
    "greyareapodcast", // Facebook
    "jenesee", // Twitch
    null, // YouTube
    "http://jenesee.com" // Website
);
greyArea.pushShow();

var imp = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/IMP-Logo-BIG-e1346187623167.png", // Icon
    "http://feeds.podtrac.com/bhOarMWlWlI$", // Audio RSS
    "The Independent Music Podcast", // Show title
    ["Pat Krane"], // Hosts
    "Pat Krane hosts a romping ride through great independent music from around the world straight to your ear holes.  Each and every show, rock, rap, folk, pop, country, reggae and more are on this international music menu.  Anything and everything is fair game!  If you like to discover great music, you’ve come to the right place.  Welcome to the IMP.", // Description
    null, // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    null // Website
);
imp.pushShow();

var irib = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2013/02/IRIB-logo-part-3a.jpg", // Icon
    "http://feeds.feedburner.com/IRememberedItbetter", // Audio RSS
    "I Remembered It.... Better", // Show title
    ["Cliff", "Ryan", "Brian"], // Hosts
    "Cliff, Ryan, and Brian look back on the nerd nostalgia we hold so dear and ask if it holds up or not. Video games, movies, TV, toys, they are taking them off the shelf and out of the box!", // Description
    "iribetter", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.iribetter.com" // Website
);
irib.pushShow();

var inside = new Show(
    "http://static.libsyn.com/p/assets/c/a/3/c/ca3cd7c5858fe12e/ItS_Logo_2.png", // Icon
    "http://insidethestudio.libsyn.com/rss", // Audio RSS
    "Inside the Studio", // Show title
    ["Pat Krane"], // Hosts
    "Pat Krane helps you get into podcasting with this short form video series and audio podcast! Go behind the scenes and learn from an experienced podcaster and audio nerd. Following the signal path from creation to completion, he’ll stop along the way to look at tech, software, microphones, budgeting and more to bring you a great overview of topics all novice podcasters should be thinking about as they unleash their creativity.", // Description
    "patkrane", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    null // Website
);
inside.pushShow();

var meh = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/MEHlogo.jpeg", // Icon
    "http://www.myepicheals.net/MEH/?feed=rss2", // Audio RSS
    "My Epic Heals", // Show title
    ["Adobe", "Buck", "Eade", "Pitango", "Wolfshade"], // Hosts
    "The podcast about all things healing in the World of Warcraft. Adobe (Shaman), Buck (Priest), Eade (Paladin), Pitango (Monk), and Wolfshade (Druid) give a perspective from each healing class in the game. This is not a “breaking WoW news of the week” type of show, but rather a roundtable style discussion among skilled yet humble players.", // Description
    "myepicheals", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.myepicheals.net/MEH" // Website
);
meh.pushShow();

var npc = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2014/08/npccasticon-e1407347499920.jpg", // Icon
    "https://npccast.wordpress.com/feed/", // Audio RSS
    "NPC Cast", // Show title
    ["Chris", "Del", "Aaron"], // Hosts
    "The NPC Cast is a tabletop gaming podcast brought to you by non-player characters Chris, Del, and Aaron. Each week these three lifelong gamers offer up their opinions and insights in regards to board, card, and role-playing games. They also take the time to tell you the things they’re excited about!", // Description
    "npccast", // Twitter handle
    "npccast", // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.npccast.com" // Website
);
npc.pushShow();

var realm = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2015/01/RM-Logo3-1400-e1421132585325.jpg", // Icon
    "http://realm-maintenance.com/feed/", // Audio RSS
    "Realm Maintenance", // Show title
    ["Rho"], // Hosts
    "Hosted by Rho, Realm Maintenance is a weekly podcast connecting listeners with news for dozens of podcasts covering World of Warcraft and other Blizzard franchise games. While the show briefly covers news for Blizzard games, its focus is on the podcasting community surrounding those games.", // Description
    "realmpodcast", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://realm-maintenance.com" // Website
);
realm.pushShow();

var startingZone = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2014/08/The-Starting-Zone-Logo-e1407347431497.png", // Icon
    "http://thestartingzone.libsyn.com/rss", // Audio RSS
    "The Starting Zone", // Show title
    ["Mick Montgomery", "Jesse Kobayashi"], // Hosts
    "Hosted by Mick Montgomery and Jesse Kobayashi, The Starting Zone is a World of Warcraft Podcast for New and Experienced Players! If you’re brand new to Warcraft, we offer kind and helpful advice. If you’ve been around Azeroth a few dozen times, then this show worksfor you as well pointing out parts of the game you may not know already. Occasionally we say funny things. The show is produced by Spazbot Studios", // Description
    "thestartingzone", // Twitter handle
    "thestartingzone", // Facebook
    "spazbotstudios", // Twitch
    "spazbotstudios", // YouTube
    "http://thestartingzone.com" // Website
);
startingZone.pushShow();

var stormCast = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2014/08/Stormcast-Logo-e1407347458206.jpg", // Icon
    "http://stormcastshow.spazbotstudios.com/feed/podcast/", // Audio RSS
    "Stormcast", // Show title
    ["Mick Montgomery", "Jesse Kobayashi"], // Hosts
    "Stormcast is a Heroes of the Storm Podcast for everyone! Hosted by Mick Montgomery and Jesse Kobayashi, Stormcast provides helpful insights and information about Blizzard Entertainment’s MOBA video game, Heroes of the Storm! Whether you are a noob or gank master there is something for everyone in this fast paced and humorous podcast! Stormcast is produced by Spazbot Studios.", // Description
    "stormcastshow", // Twitter handle
    "stormcastshow", // Facebook
    "spazbotstudios", // Twitch
    "spazbotstudios", // YouTube
    "http://stormcastshow.com" // Website
);
stormCast.pushShow();

var superOne = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/symbolLogo-e1346187602674.png", // Icon
    "http://supernumberone.libsyn.com/rss", // Audio RSS
    "Super Number One", // Show title
    ["Unknown"], // Hosts
    "Super Number One is a verbal cavalcade of the many facets in the gem of 'Geek Culture'. Video Games, Science, Movies, Music, Sci-Fi and Fantasy… we’ve got it all and each week the focus is different. It’s the je ne sais quoi of the transcendental zeitgeist. You dig? One Topic. Two Geeks. Several Beers.", // Description
    "supernumberone", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://supernumberone.net" // Website
);
superOne.pushShow();

var ttt = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/TTTSquare-e1346187583322.png", // Icon
    "http://www.taurenthinktank.com/feed.xml", // Audio RSS
    "Tauren Think Tank", // Show title
    ["Rem", "Jules"], // Hosts
    "Tauren Think Tank is the audio advice column focusing on YOU, the World of Warcraft player.  Rem and Jules answer your e-mails focused on Guild and Raid Leadership, drama with other players, conflicts with real life, personal dilemmas with the game, etc. and give you our best advice mixed with lighthearted humor. Produced by The Legendary Phytt with voiceover talents by Arcayne the Fire Mage, the TTT team is a group of great friends who love talking to you and to each other about all things WoW.  /moo!", // Description
    "taurenthinktank", // Twitter handle
    "taurenthinktank", // Facebook
    null, // Twitch
    null, // YouTube
    "http://taurenthinktank.com/" // Website
);
ttt.pushShow();

var thattv = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/11/THAT-TV-SHOW6-300x300.png", // Icon
    "http://thattvshow.libsyn.com/rss", // Audio RSS
    "That TV Show", // Show title
    ["Pat Krane", "Jules Scott"], // Hosts
    "Join your hosts Jules Scott and Pat Krane as they geek out on their favorite prime time shows every week. Covering the latest in scifi, fantasy, reality shows and other genres, they’ll dip back into the video vaults for cool and quirky older shows too. And if you’re nice, they may let you hold the remote!", // Description
    "thattvshow", // Twitter handle
    null, // Facebook
    null, // Twitch
    "TheRealPatKrane", // YouTube
    null // Website
);
thattv.pushShow();

var copilot = new Show(
    "http://www.signalsmedia.com/wp-content/uploads/2012/08/TVCopilot300x300.jpg", // Icon
    "http://feeds.feedburner.com/TvCopilot", // Audio RSS
    "TV Copilot", // Show title
    ["Johnny Feisty"], // Hosts
    "Hello, TV passengers! Johnny Feisty will be assisting you on your entertainment journey on TV Copilot, the comedy podcast about TV shows. If you like your information entertaining, but not necessarily informational, this is the podcast for you. Fun audio clips, “guests”, moderately factual trivia, and surprising interviews galore. If it’s on, it is on TV Copilot.", // Description
    "tvcopilot", // Twitter handle
    null, // Facebook
    null, // Twitch
    null, // YouTube
    "http://www.tvcopilot.com" // Website
);
copilot.pushShow();

// Initialize the main page by displaying the show icon grid
displayShows();