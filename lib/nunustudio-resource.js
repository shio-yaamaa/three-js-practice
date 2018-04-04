"use strict";

/**
 * Resource class is used to represent resources.
 * 
 * Resources store data that is used by objects.
 * 
 * @class Resource
 * @module Resources
 * @constructor
 */

/**
 * Resource name.
 * 
 * Not required to be unique.
 * 
 * @property name
 * @type {String}
 */
/**
 * UUID unique identifier.
 * 
 * @property uuid
 * @type {String}
 */
/**
 * Resource type. Used to identify the type of the resource, usefull for serialization.
 * 
 * @property type
 * @type {String}
 */
/**
 * Data format (base64, arraybuffer, blob, url, ...).
 * 
 * Indicates the format used to store the data.
 * 
 * @property format
 * @type {Object}
 */
/**
 * Data encoding (mp3, jpg, mp4, ...).
 * 
 * Indicates how the data is encoded.
 * 
 * @property encoding
 * @type {String, ArrayBuffer, ...}
 */
/**
 * Resource data.
 * 
 * @property data
 * @type {Object}
 */
function Resource(name, type)
{
	this.name = name;
	this.uuid = THREE.Math.generateUUID();
	this.type = type;

	this.format = "";
	this.encoding = ""
	this.data = null;
}

/**
 * Serialize resource to json.
 *
 * Only serializes name, uuid and type.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Resource.prototype.toJSON = function(meta)
{
	var data = {};
	
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;

	return data;
};
