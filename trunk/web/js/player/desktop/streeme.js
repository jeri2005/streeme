/*
* The Streeme Class is a javascript library for php and javascript intercommunication 
* with the streeme objects and templates
* @package    streeme
* @subpackage player-desktop
* @author     Richard Hoar
*/

//Test if JQuery is Loaded 
if( typeof $ == 'undefined' )
{
		throw ( new Error (
			"\n\n" +
			"This Application Requires the JQuery javascript framework" +
			"\n\n"
		)); 
}

//Create the Streeme Class
if( typeof streeme == 'undefined' ){ streeme = {} }

streeme = {
	/**
	* the current song id being played
	*/
	songPointer : 0,

	/**
	* the index position in the table of the current song being played
	*/
	displayPointer : 0,

	/**
	* the id of the song that's currently playing
	*/
	currentSongId : null,

	/**
	* set pagination length for the song dataTable
	*/
	iDisplayLength : 50,

	/**
	* Random / shuffling flag bool: true or false;
	*/
	random : false,

	/**
	* Record the connection speed in kb/s around when the application loads
	*/
	connectionSpeed : 0,

	/**
	* If greater than zero, Streeme will degrade quality of Media to the set bitrate
	*/
	bitrate : 0,

	/**
	 * Source Format 
	 */
	sourceFormat : false,
	
	/**
	* If not false, Streme will modify the target file format of Media to the set format
	*/
	format : false,

	/**
	* The latest song requested by the user
	*/
	queuedSongId : false,
	
	/**
	* Set the active playlist to edit
	*/
	activePlaylist : false,
	
	/**
	* Set the playing playlist - the one on the song window
	*/
	playingPlaylist : false,
	
	/**
	 * Send cookies to the media player for audio players without cookie functionality
	 */
	send_session_cookies : false,
	send_cookie_name : null,
	
	/**
	* initialize the application - project constructor
	* sets up the datatable object for songs and other general setup
	* @param results_per_page    in: number of results per page
	*/
	__initialize : function( results_per_page ) 
	{
		/**************************************************		
		 * Setup the JQuery Datatables UI Component       *
		 **************************************************/
		streeme.iDisplayLength = results_per_page;

		$('#songlist').dataTable
		( 
			{
				/* datatable config */
				"bProcessing"     : true,
				"bServerSide"     : true,
				"sAjaxSource"     : javascript_base + '/service/listSongs',
				"iDisplayLength"  : streeme.iDisplayLength,
				"bJQueryUI"       : true,
				"sPaginationType" : "full_numbers",
				"bAutoWidth"      : false,
				"bStateSave"      : true, 
				/* localize the datatable UI */
				"oLanguage" :
				{
					"sFirst"        : sFirst,
					"sLast"         : sLast,
					"sNext"         : sNext,
					"sPrevious"     : sPrevious,
					"sEmptyTable"   : sEmptyTable,
					"sInfo"         : sInfo,
					"sInfoEmpty"    : sInfoEmpty,
					"sInfoFiltered" : sInfoFiltered,
					"sLengthMenu"   : sLengthMenu,
					"sProcessing"   : sProcessing,
					"sSearch"       : sSearch,
					"sZeroRecords"  : sZeroRecords,
				},		
				/* hide the song id field from the user */
				"aoColumns" : 
				[ 
					{ "sClass" : "song_id" },
					null,
					null,
					null,
					{ "sClass" : "minor" },
					{ "sClass" : "minor" },
					{ "sClass" : "minor left" },
					{ "sClass" : "minor" },
					{ "sClass" : "song_id" }
				],
				/* default sorting by newest songs */
				"aaSorting": [[ 4, "desc" ]],
							
				"fnRowCallback" : function( nRow, aData, iDisplayIndex )
				{
					/* let each row doubleclick load the next song */
					$( nRow ).dblclick
					(
						function()
						{
							//clear user mouse selections
							streeme.clearSelection();
							 
							//play the song
							streeme.playSong( aData[0], aData[1], aData[2], aData[3], aData[8] );
							 
							//update the class pointers
							streeme.songPointer = aData[0];
							streeme.displayPointer = iDisplayIndex;
						}
					);
					
					/* additionally, there is a small single click target to load the next song */
					$( '.ps', nRow ).click
					(
						function()
						{
							//clear user mouse selections
							streeme.clearSelection();
						  
							//play the song
							streeme.playSong( aData[0], aData[1], aData[2], aData[3], aData[8] );
						  
							//update the class pointers
							streeme.songPointer = aData[0];
							streeme.displayPointer = iDisplayIndex;
						}
					);
					$( nRow ).attr( "id", "sltr" + aData[0] );
					return nRow;
				},
				
				"fnDrawCallback" : function()
				{
					//add tooltips for playlist add buttons
					if ( $( '.ap' ) )
					{
						$( '.ap' ).attr( 'title', addtoplaylist );
					}
					
					//add tooltips for playlist delete buttons
					if ( $( '.dp' ) )
					{
						$( '.dp' ).attr( 'title', deletefromplaylist );
					}
					
					//add tooltips for playlist delete buttons
					if ( $( '.ps' ) )
					{
						$( '.ps' ).attr( 'title', playsongbutton );
					}
					
					//highlight the currently playing song 
					streeme.retarget();
				}
			}
		);
		
		/**************************************************		
		 * Read and setup cookie based ui  settings       *
		 **************************************************/
		if( $.cookie('modify_bitrate') )
		{
			if( $( '#bitrateselector' ) )
			{
				$( '#bitrateselector' ).val( $.cookie( 'modify_bitrate' ) );
			}
			streeme.bitrate = $.cookie( 'modify_bitrate' );
			if( streeme.bitrate == 'auto' )
			{
				streeme.getConnectionSpeed();
			}
		}
		if( $.cookie('modify_format') )
		{
			if( $( '#formatselector' ) )
			{
				$( '#formatselector' ).val( $.cookie( 'modify_format' ) );
			}
			streeme.format = $.cookie( 'modify_format' );
		}
		
		/**************************************************		
		 * Register Event listeners for the Streeme class *
		 **************************************************/
		/* Configure the HTML5 Audio/Video Tag listeners */
		if( $( '#musicplayer' ) )
		{
			//the song unloaded normally
			$( '#musicplayer' ).bind( 'ended', streeme.playNextSong );
			
			//The file was not the size reported or the codec is missing 
			$( '#musicplayer' ).bind( 'error', function(){ if( this.error.code == 4 ) streeme.playNextSong(); } );
		}
		
		/* Button listeners */ 
		if( $( '#next' ) )
		{
			$( '#next' ).click( streeme.playNextSong );
		}
		if( $( '#previous' ) )
		{
			$( '#previous' ).click( streeme.playPreviousSong );
		}
		if( $( '#random' ) )
		{
			$( '#random' ).click( streeme.playRandom );
		}
		if( $( '#settings' ) )
		{
			$( '#settings' ).click( function(event)
				{ 
					streeme.toggleSettingsWindow();
				}
			);
		}
		if( $( '#playlists' ) )
		{
			$( '#playlists' ).click( function(event)
				{ 
					streeme.togglePlaylistsWindow();
				}
			);
		}
		if( $( '#logout' ) )
		{
			$( '#logout' ).click( streeme.logout );
		}
		if( $( '#bitrateselector' ) )
		{
			$( '#bitrateselector' ).change( streeme.updateBitrate );
			$( '#bitrateselector' ).keyup( streeme.updateBitrate );
		}
		if( $( '#formatselector' ) )
		{
			$( '#formatselector' ).change( streeme.updateFormat );
			$( '#formatselector' ).keyup( streeme.updateFormat );
		}
		if( $( '#genreselector' ) )
		{
			$( '#genreselector' ).change( streeme.chooseGenre );
			$( '#genreselector' ).keyup( streeme.chooseGenre );
		}
		if( $( '#cancelsearch' ) )
		{
			$( '#cancelsearch' ).click( streeme.clearSearch );
		}
		if( $( '#addplaylist' ) )
		{
			$( '#addplaylist' ).click( streeme.addPlaylist );
		}
		
		/**************************************************		
		 * Run initial setup scripts                      *
		 **************************************************/
		streeme.uiAdjustHeight();
		streeme.cancelSearch();
		streeme.send_session_cookies = send_session_cookies;
		streeme.send_cookie_name = send_cookie_name;
		$( window ).bind ( 'resize', streeme.uiAdjustHeight );
		
		$( '#songlist_filter > input' ).bind('keyup', function(){ streeme.cancelSearch() });
		
		$('html').dblclick( streeme.clearSelection );
		
		window.onbeforeunload = function()
		{
			return appExitMessage;
		}
		
		/**************************************************		
		 * Register event timers                          *
		 **************************************************/
		setInterval( streeme.playSongInQueue, 1000 );
	},

	/**
	* User has chosen a track to play from the songlist, update the player
	* @param song_id 			int: database id for the song 
	* @param song_name 		str: name of the song
	* @param album_name 	str: name of the album to which this song belongs
	* @param artist_name 	str: name of the artist to which this song belongs
	* @param file_type      str: mp3|m4a|oga|webma|wav * this is the jPlayer spec
	*/
	playSong : function( song_id, song_name, album_name, artist_name, file_type )
	{
		//queue up the song for the next play cycle
		streeme.sourceFormat = file_type; 
		streeme.queuedSongId = song_id;
	
		//remove previous song tr cursor
		$( 'table.songlist tbody tr.nowplaying' ).removeClass( 'nowplaying' );
		
		if( $( '#sltr' + song_id ) )
		{
			//update playing song tr cursor
			$( '#sltr' + song_id ).addClass( 'nowplaying' ); 

			//scroll to the current song entry
			if( $( '#songlistcontainer' ) && $( '#songlist' ) )
			{
				setTimeout(function()
				{ 	
					var trHeight = ( streeme.displayPointer * $( '#songlist tbody tr' ).css('height').replace( 'px', '' ) - 205 );
					if( trHeight < 30 ) trHeight = 0;
					$('#songlistcontainer').scrollTo( trHeight, 200 );
				}
				, 50 );
			}

			//update the songname
			if( $( '#songtitle' ) )
			{
				$( '#songtitle' ).text( artist_name + ' - ' + streeme.stripTags( song_name ) ); 
			}

			//add album art to the viewer
			if( $( '#albumart' ) )
			{
				$( '#albumart' ).html( '<a href="' + javascript_base + '/art/' + $.md5( artist_name + album_name ) + '/large" title="' + album_name + '" rel="albumartzoom"><img src="' + javascript_base + '/art/' + $.md5( artist_name + album_name ) + '/medium" alt="' + sAlbumArtImageAlt + ' ' + album_name + '" class="albumimg" border="0"/></a>' );
				$( '#magnify_art' ).html( '<a href="' + javascript_base + '/art/' + $.md5( artist_name + album_name ) + '/large" title="' + album_name + '" rel="albumartzoom_mag"><img src="' + rooturl + '/images/player/desktop/h5-icon-magnify.png" alt="' + sAlbumArtImageAlt + ' ' + album_name + '" border="0"/></a>' ); 
				$( "a[ rel='albumartzoom' ]" ).colorbox( { photo: true, maxWidth: "550px" });
				$( "a[ rel='albumartzoom_mag' ]" ).colorbox( { photo: true, maxWidth: "550px" });
			}

			if( $( '#next' ) )
			{
				$( '#next' ).addClass( 'nextsong' );
				$( '#next' ).removeClass( 'nextsongdisabled' );
			}
			if( $( '#previous' ) )
			{
				$( '#previous' ).addClass( 'previoussong' );
				$( '#previous' ).removeClass( 'previoussongdisabled' );
			}
		}
		streeme.songPointer = song_id;
	},
	
	/**
	* Some browsers get unstable if send too many play requests through the javascript API
	* poll this at the fastest rate possible before the browser begins to fail
	*/
	playSongInQueue : function()
	{
		if( streeme.queuedSongId != false )
		{
			//build HTTP request for the song	
			var parameters = new Array();
			if( streeme.bitrate != 0 )
			{
				parameters.push( 'target_bitrate=' + streeme.bitrate ); 
			}
			if( streeme.format != false )
			{
				parameters.push( 'target_format=' + streeme.format );
			}
			if( streeme.send_session_cookies )
			{
				parameters.push(  streeme.send_cookie_name + '=' + $.cookie( streeme.send_cookie_name ) );
			}
	
			url = mediaurl + '/play/' + streeme.queuedSongId + ( ( parameters.length > 0 ) ? '?' : '' )  + parameters.join('&');
					
			var setMedia_format = ( streeme.format ) ? streeme.format : streeme.sourceFormat; 
			
			//for some browsers, we need to use jplayer to patch up the media player
			if( $( '#jquery_jplayer_1' ).length )
			{
				switch( setMedia_format )
				{
					case 'mp3':
						$("#jquery_jplayer_1").jPlayer( "destroy" );
						$("#jquery_jplayer_1").jPlayer({
						    ready: function() {
						      $(this).jPlayer("setMedia", {
						        mp3: url
						      }).jPlayer("play");
							},
                            ended: function() { 
                              streeme.playNextSong();
                            },
                            swfPath: "/js/jQuery.jPlayer.2.0.0",
                            solution: "flash, html",
                            supplied: "mp3",
                            volume: 1,
                          });				
						break;
						
					case 'ogg':
						$("#jquery_jplayer_1").jPlayer( "stop" );
						$("#jquery_jplayer_1").jPlayer( "clearMedia" );
						$("#jquery_jplayer_1").jPlayer( "destroy" );
						$("#jquery_jplayer_1").jPlayer({
						    ready: function() {
						      $(this).jPlayer("setMedia", {
						        oga: url
						      }).jPlayer("play");
							},
                            ended: function() { 
                              streeme.playNextSong();
                            },
                            swfPath: "/js/jQuery.jPlayer.2.0.0",
                            solution: "html",
                            supplied: "oga",
                            volume: 1,
                          });				
						break;
				}		
			}
			
			//otherwise use the browser's html player 
			else
			{				
				//firefox/chrome logging only 
				//console.log ( url );
				el = document.getElementById( 'musicplayer' );
				el.src = ( url );
				el.preload = 'none';
				el.load();
				el.play(); 
			}
			
			//clear the queue
			streeme.queuedSongId = false;
		}
	},
	
	/**
	* Play the next song (in relation to what's playing now) in a given series and ordering from DataTables
	*/
	playNextSong : function()
	{
		try
		{
			var nextSongData = $( '#songlist' ).dataTable().fnGetData( streeme.displayPointer + 1 )
		}
		catch( err )
		{
			//attempt to move to the next page
			try
			{
				if( $( '#songlist_next' ) )
				{
					classList = $( '#songlist_next' ).attr('class').split(' ');
					$.each( classList, function(index, item )
					{
						if(item === 'ui-state-disabled' )
						{
							throw "next page does not exist"; //bit of a hack
							return false;
						}
					});
				}
			
				//move to the next page
				$( '#songlist' ).dataTable().fnPageChange( 'next' );
				
				//let the page redraw and then update the song pointers
				setTimeout(function()
				{ 	
					nextSongData = $( '#songlist' ).dataTable().fnGetData( 0 );
					if( nextSongData )
					{
						streeme.playSong( nextSongData[ 0 ], nextSongData[ 1 ], nextSongData[ 2 ], nextSongData[ 3 ], nextSongData[ 8 ] );
					}
					streeme.displayPointer = 0;
				}
				, 2000);
				
				//scroll back to the top of the container
				if( $( '#songlistcontainer' ) )
				{
					$( '#songlistcontainer' ).scrollTo( 0 );
				}

				//let Javascript get back to work
				return false;
			}
			catch( err )
			{
				if( $( '#next' ) )
				{
				  $( '#next' ).removeClass( 'nextsong' );
					$( '#next' ).addClass( 'nextsongdisabled' );
				}
				//firefox and chrome only
				//console.log ( 'no next songs' );
			} 
		}
		if( nextSongData )
		{
			streeme.playSong( nextSongData[ 0 ], nextSongData[ 1 ], nextSongData[ 2 ], nextSongData[ 3 ], nextSongData[ 8 ] );
			streeme.displayPointer++;
		}
	},

	/**
	* Play the previous song (in relation to what's playing now) in a given series and ordering from DataTables
	*/
	playPreviousSong : function()
	{
		try
		{
			var previousSongData = $( '#songlist' ).dataTable().fnGetData( streeme.displayPointer - 1 )
		}
		catch( err )
		{
			//attempt to move to the previous page
			try
			{
				if( $( '#songlist_previous' ) )
				{
					classList = $( '#songlist_previous' ).attr('class').split(' ');
					$.each( classList, function(index, item )
					{
						if(item === 'ui-state-disabled' )
						{
							throw "previous page does not exist"; //bit of a hack
							return false;
						}
					});
				}

				//move to the previous page
				$( '#songlist' ).dataTable().fnPageChange( 'previous' );
				
				//let the page redraw and then update the song pointers
				setTimeout(function()
				{
					previousSongData = $( '#songlist' ).dataTable().fnGetData( streeme.iDisplayLength - 1	);
					if( previousSongData )
					{
						streeme.playSong( previousSongData[ 0 ], previousSongData[ 1 ], previousSongData[ 2 ], previousSongData[ 3 ], previousSongData[ 8 ]);
					}
					streeme.displayPointer = streeme.iDisplayLength - 1;
				}
				, 2000);

				//scroll back to the top of the container
				if( $( '#songlistcontainer' ) && $( '#songlist' ))
				{
					$( '#songlistcontainer' ).scrollTo( $( '#songlist' ).height() );
				}

				//let Javascript get back to work
				return false;
			}
			catch( err )
			{
				if( $( '#previous' ) )
				{
					$( '#previous' ).removeClass( 'previoussong' );
					$( '#previous' ).addClass( 'previoussongdisabled' );
				}
				//firefox and chrome only
				//console.log ( 'no previous songs' );
			} 
		}
		if( previousSongData )
		{
			streeme.playSong( previousSongData[ 0 ], previousSongData[ 1 ], previousSongData[ 2 ], previousSongData[ 3 ], previousSongData[ 8 ] );
			streeme.displayPointer--;
		}
	},
	
	/**
	* create a playlist of randomly ordered songs and preserve current searches
	* where required
	*/
	playRandom : function()
	{
		//toggle the random button and the class variable
		if( streeme.random )
		{
			if( $( '#songlist_filter input' ) )
			{
				curval = $( '#songlist_filter > input' ).val();
				$( '#songlist_filter > input' ).val( $.trim( curval.replace( 'shuffle:1' , '' ) ) );
				$( '#songlist_filter > input' ).trigger('keyup');
			}
			if( $( '#random' ) )
			{
			  $( '#random' ).addClass( 'randomsong' );  
			  $( '#random' ).removeClass( 'randomsongactive' )  
			}

			streeme.random = false;
		}
		else
		{
			if  ( $( '#songlist_filter input' ) )
			{
				//add a shuffle / random parameter to the current search 
				curval = $( '#songlist_filter > input' ).val();
				$( '#songlist_filter > input' ).val( curval + ' shuffle:1' );
				$( '#songlist_filter > input' ).trigger('keyup');
			}
			
			if( $( '#random' ) )
			{
				$( '#random' ).addClass( 'randomsongactive' );  
				$( '#random' ).removeClass( 'randomsong' );  
			}
			
			streeme.random = true;
		}
	},
	
	/**
	* Attempt to relocate the current song in the newly drawn matrix and reset the pointers
	*/
	retarget : function()
	{
		//when a user searches and returns to the global view, we need to 
		//retarget the song that's playing on each draw
		try
		{
			var drawData = $( '#songlist' ).dataTable().fnGetData();
			for ( var i; i < drawData.length; i++ )
			{
				if( drawData[i] == streeme.songPointer )
				{
					streeme.displayPointer = i;
				} 
			}
		}
		catch( err )
		{
			return false;
		}
		
		//highlight the current song if it's in view
		if( $( '#sltr' + streeme.songPointer ) )
		{
			$('#sltr' + streeme.songPointer ).addClass( 'nowplaying' )
		}
		 
		//Highlight the header 
		$( '#songlist thead tr th.sorting' ).removeClass('sorting');
		$('span.ui-icon-triangle-1-s').parent().addClass('sorting');
		$('span.ui-icon-triangle-1-n').parent().addClass('sorting');
	},
	
	/**
	* Narrow a song list by artist 
	* @param artist_id int: database artist_id for the artist
	*/
	chooseArtist : function( artist_id )
	{
		if  ( $( '#songlist_filter input' ) )
		{
			$( '#songlist_filter > input' ).val( 'artistid:' + artist_id + ( ( streeme.random ) ? ' shuffle:1' : '' ) );
			$( '#songlist_filter > input' ).trigger('keyup');
		}
	},

	/**
	* Narrow a song list by album 
	* @param album_id int: database album_id for the album
	*/
	chooseAlbum : function( album_id )
	{
		if  ( $( '#songlist_filter input' ) )
		{
			$( '#songlist_filter > input' ).val( 'albumid:' + album_id + ( ( streeme.random ) ? ' shuffle:1' : '' ) );
			$( '#songlist_filter > input' ).trigger('keyup');
		}
	},

	/**
	* Narrow a song list by genre
	* @param genre_id int: database genre_id for the artist
	*/
	chooseGenre : function()
	{
		if( $( '#genreselector' ) )
		{
			genre_id = $( '#genreselector option:selected').val();
		}
		
		if  ( $( '#songlist_filter input' ) && genre_id != 'none' )
		{
			$( '#songlist_filter > input' ).val( 'genreid:' + genre_id + ( ( streeme.random ) ? ' shuffle:1' : '' ) );
			$( '#songlist_filter > input' ).trigger('keyup');
		}
		else
		{
			$( '#songlist_filter > input' ).val( '' );
			$( '#songlist_filter > input' ).trigger('keyup');
		}
	},
	
	/**
	* Narrow a song list by playlist
	* @param playlist_id int: database playlist_id for the playlist
	*/
	choosePlaylist : function( playlist_id )
	{
		if  ( $( '#songlist_filter' ) )
		{
			streeme.playingPlaylist = playlist_id;
 			$( '#songlist_filter > input' ).val( 'playlistid:' + playlist_id + ( ( streeme.random ) ? ' shuffle:1' : '' ) );
			$( '#songlist_filter > input' ).trigger('keyup');
			streeme.hidePlaylistButtons();
		}
	},
	
	/**
	* Hide playlist add buttons while a playlist is being viewed
	*/
	hidePlaylistButtons : function()
	{
		$( '.ap' ).hide();
	},
	
	/**
	* Show playlist add buttons while a playlist is being viewed
	*/
	showPlaylistButtons : function()
	{
		$( '.ap' ).show();
	},
	
	
	/**
	* Narrow a song list by playlist
	* @param playlist_id int: database playlist_id for the playlist
	*/
	setActivePlaylist : function( playlist_id )
	{
		if  ( $( '#plli' + streeme.activePlaylist ) )
		{
			$( '#plli' + streeme.activePlaylist ).removeClass( 'highlight' );
		}
		if  ( $( '#plli' + playlist_id ) )
		{
			$( '#plli' + playlist_id ).addClass( 'highlight' );
		}
		streeme.activePlaylist = playlist_id;
	},

	/**
	* Add an item to the current playlist
	* @param type str: song|artist|album
	* @id 	 id   str: key for each type
	*/
	addpls : function( type, id )
	{
		//firefox/chrome logging only 
		//console.log( streeme.activePlaylist + ' ' + type + ' ' + id );
		$.ajax
		(
			{ 
				url: javascript_base + '/service/addPlaylistContent',
				data: ({ 'playlist_id' : streeme.activePlaylist, 'type' : type, 'id' : id }),
				type: "POST",
				context: document.body,
				success: function()
				{
      		$( '#dropzone' ).text( addItemSuccess ).show( 80 ).delay( 1500 ).hide( 80 );
    		},
    		error: function()
    		{
    			$( '#dropzone' ).text( addItemError ).show( 80 ).delay( 1500 ).hide( 80 ); 
    		}
    	}
    );
	},
	
	/**
	* Remove an item from the current playlist
	* @id 	 id   str: key for the song to remove
	*/
	delpls : function( id )
	{
		//firefox/chrome logging only 
		//console.log( streeme.activePlaylist + ' ' + id );
		$.ajax
		(
			{ 
				url: javascript_base + '/service/deletePlaylistContent',
				data: ({ 'playlist_id' : streeme.playingPlaylist, 'id' : id }),
				type: "POST",
				context: document.body,
				success: function()
				{
      		$( '#dropzone' ).text( deleteItemSuccess ).show( 80 ).delay( 1500 ).hide( 80 );
      		$( '#songlist_filter > input' ).trigger('keyup');
    		},
    		error: function()
    		{
    			$( '#dropzone' ).text( deleteItemError ).show( 80 ).delay( 1500 ).hide( 80 ); 
    		}
    	}
    );
	},
	
	/**
	* Add a playlist
	*/
	addPlaylist : function()
	{
		var playlistName = prompt( playlistNameInput, "");
		if( playlistName == null ) return false;
		//firefox/chrome logging only 
		//console.log( playlistName );
		$.ajax
		(
			{ 
				url: javascript_base + '/service/addPlaylist',
				data: ({ 'name' : playlistName }),
				type: "POST",
				context: document.body,
				success: function()
				{
		      		$( '#dropzone' ).text( addPlaylistSuccess ).show( 80 ).delay( 1500 ).hide( 80 );
		      		setTimeout( streeme.refreshPlaylist, 300 );
	    		},
    		error: function()
    		{
    			$( '#dropzone' ).text( addPlaylistError ).show( 80 ).delay( 1500 ).hide( 80 ); 
    		}
    	}
    );
	
	},
	
	/**
	* Delete a playlist
	* @param id int: the playlist database id
	*/
	deletePlaylist : function( id )
	{
		if (confirm( confirmDelete ))

		//firefox/chrome logging only 
		//console.log( id );
		$.ajax
		(
			{ 
				url: javascript_base + '/service/deletePlaylist',
				data: ({ 'playlist_id' : id }),
				type: "POST",
				context: document.body,
				success: function()
				{
		      		$( '#dropzone' ).text( deletePlaylistSuccess ).show( 80 ).delay( 1500 ).hide( 80 );
		      		setTimeout( streeme.refreshPlaylist, 300 );
	    		},
    		error: function()
    		{
    			$( '#dropzone' ).text( deletePlaylistError ).show( 80 ).delay( 1500 ).hide( 80 ); 
    		}
    	}
    );
	},
	
	/**
	* Refresh a playlist
	* @param id int: the playlist database id
	*/
	refreshPlaylist : function()
	{
		//firefox/chrome logging only 
		//console.log( id );
		$.ajax
		(
			{ 
				url: javascript_base + '/player/desktop/playlist?time=' + new Date().getTime(),
				type: "GET",
				success: function( retdata )
				{
	      			$( '#playlistcontainer' ).html( retdata );
	    		}
	    	}
	    );
	},
	
	/**
	* Search songs, artists and albums 
	* @param keywords str: keywords to search
	*/
	search : function( keywords )
	{
		//this streeme JSAPI uses JQuery DataTables to search
	},
	
	/**
	* Show a Cancel button for searches if the user types or chooses artists/albums/playlists
	*/
	cancelSearch : function()
	{
		if( $( '#cancelsearch' ) && $( '#songlist_filter > input' ) ) 
		{
			if( $( '#songlist_filter input' ).val() == '' )
			{
				if( $( '#cancelsearch' ).is( ":visible" ) )
				{
					$( '#cancelsearch' ).hide(50);
				}				
			}
			else
			{
				if( $( '#cancelsearch' ).is( ":hidden" ) )
				{
					$( '#cancelsearch' ).show(50);
				}
			}
		}
	},

	/**
	* if the user clicks the cancle button over the search box, delete the contents and hide the 
	* cancel button.
	*/
	clearSearch : function()
	{
		if( $( '#cancelsearch' ) && $( '#songlist_filter input' ) ) 
		{
			$( '#songlist_filter input' ).val( '' );
			$( '#songlist_filter input' ).trigger('keyup');
			$( '#random' ).addClass( 'randomsong' );  
			$( '#random' ).removeClass( 'randomsongactive' );
			streeme.random = false;
			streeme.playingPlaylist = false;
			streeme.showPlaylistButtons();
		}
	},

	/**
	* get the equivalent MP3 bitrate for the reported connection speed based on a janky formula:
	* @param speed: int - the returning speed factor from getConnectionSpeed
	* @see  http://techallica.com/kilo-bytes-per-second-vs-kilo-bits-per-second-kbps-vs-kbps
	*/
	setAutoBitrate : function( speed )
	{
		switch ( true ) 
		{
			case ( speed < 15 ):
				streeme.bitrate = 48;
				break;
			case ( speed < 25 ):
				streeme.bitrate = 96;
				break;
			case ( speed < 35 ):
				streeme.bitrate = 128;
				break;
			case ( speed < 40 ):
				streeme.bitrate = 192;
				break;
			case (speed < 45 ):
				streeme.bitrate = 256;
				break;
			case (speed < 55 ):
				streeme.bitrate = 320;
				break;
			case ( speed < 99999999 ):
				streeme.bitrate = 0;
				break;
		}
		//firefox/chrome logging only 
		//console.log ( ( streeme.bitrate != 0 ) ? 'music will be downsampled to: ' + streeme.bitrate + 'k' : 'connection supports all audio speeds - playing original' );
	},
	
	/**
	* Update the bitrate state for the app
	*/
	updateBitrate : function()
	{
		selected_bitrate = $( '#bitrateselector' ).val();
		
		if( selected_bitrate > 0 )
		{
			$.cookie( 'modify_bitrate', selected_bitrate,  { expires: 3000 } );
			streeme.bitrate = selected_bitrate;
		}
		else if( selected_bitrate == 'auto' )
		{
		  $.cookie('modify_bitrate', 'auto', { expires: 3000 } );
			streeme.getConnectionSpeed();
		}
		if( selected_bitrate == 0 )
		{
			$.cookie('modify_bitrate', null );
			streeme.bitrate = 0;
		}
		//firefox/chrome logging only 
		//console.log( streeme.bitrate );
	},

	/**
	* Update the format state for the app
	*/
	updateFormat : function()
	{
		selected_format = $( '#formatselector').val();
		
		if( selected_format != 0 )
		{
			$.cookie('modify_format', selected_format, { expires: 3000 } );
			streeme.format = selected_format;
		}
		if( selected_format == 0 )
		{
			$.cookie('modify_format', null );
			streeme.format = false;
		}
		//firefox/chrome logging only 
		//console.log( streeme.format );
	},

	/**
	* Open the Settings Window for Player Relevant settings 
	*/
	toggleSettingsWindow : function()
	{
		if( $( '#settingsmodalwindow' ) )
		{
			$( '#settingsmodalwindow' ).toggle(120);
		}
	},

	/**
	* Open the Playlists Window for user playlists
	*/
	togglePlaylistsWindow : function()
	{
		if( $( '#playlistsmodalwindow' ) )
		{
			$( '#playlistsmodalwindow' ).toggle(120);
		}
	},

	/**
	* Logout 
	*/
	logout : function()
	{
	
	},

	/**
	* Helper to remove ugly selection smears after a user doubleclicks
	*/
	clearSelection : function()
	{
		var sel;
		if(document.selection && document.selection.empty)
		{
			document.selection.empty() ;
		}
		else if(window.getSelection)
		{
			sel=window.getSelection();
			if(sel && sel.removeAllRanges)
			{
				sel.removeAllRanges();
			}
		} 
	},

	/*
	* Helper to determine user's connection speed with the server to help improve streaming
	* uses 2 passes with a total page load over head of just under 80kb to test 
	* it's a bit expensive, so leave auto mode off when not required.
	* sets streeme.connectionSpeed;
	*/
	getConnectionSpeed: function()
	{
		var d     = new Date;
		var start = d.getTime();
		dump      = $.get( rooturl + '/images/speedtest_bin/st.bin', function()
						{
							var d = new Date;
							var time = ( d.getTime() - start ) / 10 / 100;
							streeme.connectionSpeed = ( 39013 / time / 1000 );
							var e = new Date;
							var estart = e.getTime();
							dump = $.get( rooturl + '/images/speedtest_bin/st.bin', function()
								{
									var e = new Date;
									var etime = ( e.getTime() - estart ) / 10 / 100;
									streeme.connectionSpeed = ( ( 39013 / etime / 1000 ) + streeme.connectionSpeed ) / 2;
									streeme.setAutoBitrate( streeme.connectionSpeed );
								}
							);
						}
					);
	},
	
	/**
	* Adjusts the height of elements in the content part of the UI framing to use the users entire screen
	* Adds an Event Listener to continuously check for window resizing. Function should be called once 
	* At the end of the HTML body
	*/
	uiAdjustHeight : function()
	{
		var viewportwidth;
		var viewportheight;
		var newheight;
		
		if (typeof window.innerWidth != 'undefined')
		{
			viewportwidth = window.innerWidth,
			viewportheight = window.innerHeight
		}
		
		newheight = viewportheight - 130;
		
		document.getElementById( 'content' ).style.height = newheight + 'px';
		document.getElementById( 'columnleft' ).style.height = newheight + 'px';
		document.getElementById( 'columnright' ).style.height = newheight + 'px';
		document.getElementById( 'songlistcontainer' ).style.height = newheight + 'px';
		
		leftcolumn = newheight - 93;
		
		document.getElementById( 'ctbrowseartists' ).style.height = Math.floor( leftcolumn / 2 ) - 30 + 'px';
		document.getElementById( 'ctbrowsealbums' ).style.height = Math.floor( leftcolumn / 2 ) - 15 + 'px';
	},
	
	/**
	* Scrolls the sidebar ui when a letter is selected from the list
	* @param element_id   str: name of the window 
	* @param target       str: name of the id to scroll to
	* @return             false to supress the default action of the anchor 
	*/
	uiLetterbarScroll : function( element_id, target )
	{
		try
		{
			$( '#lc' + element_id ).scrollTo( $( '#' + target ), 200 );
			return false;
		}
		catch( err )
		{
			return false;
		}
	},
	
	/**
	* Strip HTML from a string
	* @param string to modify
	* @return string cleaned of HTML tags
	*/
	stripTags : function( string )
	{
	  return string.replace(/<\/?[^>]+>/gi, '');
	}
}