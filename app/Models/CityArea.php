<?php
/**
 *  app/Models/CityArea.php
 *
 * Date-Time: 21.04.22
 * Time: 15:15
 * @author Vito Makhatadze <vitomakhatadze@gmail.com>
 */

namespace App\Models;

use App\Models\Translations\CityAreaTranslation;
use Astrotomic\Translatable\Translatable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


/**
 * App\Models\CityArea
 *
 * @property int $id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 */
class CityArea extends Model
{
    use HasFactory, SoftDeletes, Translatable;

    /** @var string */
    protected $table = 'city_areas';

    /** @var string[] */
    protected $fillable = [
        'title',
    ];

    /** @var string */
    protected string $translationModel = CityAreaTranslation::class;

    /** @var array */
    public array $translatedAttributes = [
        'title',
    ];
}
