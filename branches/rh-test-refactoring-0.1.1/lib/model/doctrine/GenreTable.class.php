<?php

/**
 * GenreTable
 *
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class GenreTable extends Doctrine_Table
{
  /**
   * Returns an instance of this class.
   *
   * @return object GenreTable
   */
  public static function getInstance()
  {
      return Doctrine_Core::getTable('Genre');
  }

  /**
   * Add a custom genre to the database or get its key if it exists
   * @param name str: the name of the genre to add
   * @return     int: the primary key added or found
   */
  public function addGenre( $name )
  {
    //is this name already in the collection?
    $q = Doctrine_Query::create()
      ->select( 'g.id' )
      ->from( 'Genre g' )
      ->where( 'g.name = ?', $name);
    $result = $q->fetchOne();
     
    if ( is_object( $result ) && $result->id > 0 )
    {
      return $result->id;
    }
    else
    {
      $item = new Genre;
      $item->name = $name;
      $item->save();
      return $item->getId();
    }
  }
  
  /**
   * Fetch the genre list - sensitive to user's content
   * @param alpha str: the alphabetical grouping
   * @return array of all genre entries
   */
  public function getList( $alpha = 'all' )
  {
    $q = Doctrine_Query::create()
      ->select( 'g.id, g.name' )
      ->from( 'Genre g, Song s' )
      ->where( 'g.id = s.genre_id' )
      ->andWhere( 'g.name != ""' );
    if( $alpha !== 'all' )
    {
      $q->andWhere( 'g.name LIKE ?', substr( $alpha, 0, 1 ) . '%' );
    }
    $q->distinct()
      ->orderBy( 'g.name ASC' );
    return $q->fetchArray();
  }
}