<?php
// Connection Component Binding
Doctrine_Manager::getInstance()->bindComponent('EchonestProperties', 'doctrine');

/**
 * BaseEchonestProperties
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $id
 * @property string $en_item_id
 * @property string $en_version
 * @property string $en_date_added
 * @property string $en_artist_id
 * @property string $en_song_id
 * @property string $en_foreign_id
 * @property string $en_audio_md5
 * @property string $en_location
 * @property integer $en_mode
 * @property integer $en_time_signature
 * @property integer $en_key
 * @property float $en_duration
 * @property float $en_loudness
 * @property float $en_energy
 * @property float $en_tempo
 * @property float $en_danceability
 * @property float $en_song_hotttnesss
 * @property float $en_artist_hotttnesss
 * @property float $en_artist_familiarity
 * @property float $en_latitude
 * @property float $en_longitude
 * 
 * @method integer            getId()                    Returns the current record's "id" value
 * @method string             getEnItemId()              Returns the current record's "en_item_id" value
 * @method string             getEnVersion()             Returns the current record's "en_version" value
 * @method string             getEnDateAdded()           Returns the current record's "en_date_added" value
 * @method string             getEnArtistId()            Returns the current record's "en_artist_id" value
 * @method string             getEnSongId()              Returns the current record's "en_song_id" value
 * @method string             getEnForeignId()           Returns the current record's "en_foreign_id" value
 * @method string             getEnAudioMd5()            Returns the current record's "en_audio_md5" value
 * @method string             getEnLocation()            Returns the current record's "en_location" value
 * @method integer            getEnMode()                Returns the current record's "en_mode" value
 * @method integer            getEnTimeSignature()       Returns the current record's "en_time_signature" value
 * @method integer            getEnKey()                 Returns the current record's "en_key" value
 * @method float              getEnDuration()            Returns the current record's "en_duration" value
 * @method float              getEnLoudness()            Returns the current record's "en_loudness" value
 * @method float              getEnEnergy()              Returns the current record's "en_energy" value
 * @method float              getEnTempo()               Returns the current record's "en_tempo" value
 * @method float              getEnDanceability()        Returns the current record's "en_danceability" value
 * @method float              getEnSongHotttnesss()      Returns the current record's "en_song_hotttnesss" value
 * @method float              getEnArtistHotttnesss()    Returns the current record's "en_artist_hotttnesss" value
 * @method float              getEnArtistFamiliarity()   Returns the current record's "en_artist_familiarity" value
 * @method float              getEnLatitude()            Returns the current record's "en_latitude" value
 * @method float              getEnLongitude()           Returns the current record's "en_longitude" value
 * @method EchonestProperties setId()                    Sets the current record's "id" value
 * @method EchonestProperties setEnItemId()              Sets the current record's "en_item_id" value
 * @method EchonestProperties setEnVersion()             Sets the current record's "en_version" value
 * @method EchonestProperties setEnDateAdded()           Sets the current record's "en_date_added" value
 * @method EchonestProperties setEnArtistId()            Sets the current record's "en_artist_id" value
 * @method EchonestProperties setEnSongId()              Sets the current record's "en_song_id" value
 * @method EchonestProperties setEnForeignId()           Sets the current record's "en_foreign_id" value
 * @method EchonestProperties setEnAudioMd5()            Sets the current record's "en_audio_md5" value
 * @method EchonestProperties setEnLocation()            Sets the current record's "en_location" value
 * @method EchonestProperties setEnMode()                Sets the current record's "en_mode" value
 * @method EchonestProperties setEnTimeSignature()       Sets the current record's "en_time_signature" value
 * @method EchonestProperties setEnKey()                 Sets the current record's "en_key" value
 * @method EchonestProperties setEnDuration()            Sets the current record's "en_duration" value
 * @method EchonestProperties setEnLoudness()            Sets the current record's "en_loudness" value
 * @method EchonestProperties setEnEnergy()              Sets the current record's "en_energy" value
 * @method EchonestProperties setEnTempo()               Sets the current record's "en_tempo" value
 * @method EchonestProperties setEnDanceability()        Sets the current record's "en_danceability" value
 * @method EchonestProperties setEnSongHotttnesss()      Sets the current record's "en_song_hotttnesss" value
 * @method EchonestProperties setEnArtistHotttnesss()    Sets the current record's "en_artist_hotttnesss" value
 * @method EchonestProperties setEnArtistFamiliarity()   Sets the current record's "en_artist_familiarity" value
 * @method EchonestProperties setEnLatitude()            Sets the current record's "en_latitude" value
 * @method EchonestProperties setEnLongitude()           Sets the current record's "en_longitude" value
 * 
 * @package    streeme
 * @subpackage model
 * @author     Richard Hoar
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
abstract class BaseEchonestProperties extends sfDoctrineRecord
{
    public function setTableDefinition()
    {
        $this->setTableName('echonest_properties');
        $this->hasColumn('id', 'integer', null, array(
             'type' => 'integer',
             'primary' => true,
             'autoincrement' => true,
             ));
        $this->hasColumn('en_item_id', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_version', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_date_added', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_artist_id', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_song_id', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_foreign_id', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_audio_md5', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_location', 'string', 255, array(
             'type' => 'string',
             'length' => 255,
             ));
        $this->hasColumn('en_mode', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('en_time_signature', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('en_key', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('en_duration', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_loudness', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_energy', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_tempo', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_danceability', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_song_hotttnesss', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_artist_hotttnesss', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_artist_familiarity', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_latitude', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));
        $this->hasColumn('en_longitude', 'float', 18, array(
             'type' => 'float',
             'scale' => 12,
             'length' => 18,
             ));


        $this->index('en_item_id_index', array(
             'fields' => 
             array(
              0 => 'en_item_id',
             ),
             ));
        $this->option('collate', 'utf8_unicode_ci');
        $this->option('charset', 'utf8');
    }

    public function setUp()
    {
        parent::setUp();
        
    }
}