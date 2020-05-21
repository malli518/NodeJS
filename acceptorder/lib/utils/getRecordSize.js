

function getRecordSize(record) {
	var dataLength = Buffer.byteLength(record.Data, 'binary');
	console.log(`dataLength: ${dataLength}`);
	var newBytes = getSizeIncrement(record.PartitionKey);
	console.log(`PartitionKeySize: ${newBytes}`);
	var recordSize = calculateVarIntSize(0);
	if (record.ExplicitHashKey) {
		newBytes += getSizeIncrement(record.ExplicitHashKey);
		recordSize += 1 + calculateVarIntSize(0);
	}
	recordSize += 2 + calculateVarIntSize(dataLength) + dataLength;
	console.log(`recordSize: ${recordSize}`);
	newBytes += 1 + calculateVarIntSize(recordSize) + recordSize;
	return newBytes;
};

function calculateVarIntSize(value) {
	if (value < 0) {
		raise
		Error("Size values should not be negative.");
	} else if (value == 0) {
		return 1;
	}

	var numBitsNeeded = 0;

	// shift the value right one bit at a time until
	// there are no more '1' bits left...this should count
	// how many bits we need to represent the number
	while (value > 0) {
		numBitsNeeded++;
		value = value >> 1;
	}

	// varints only use 7 bits of the byte for the actual value
	var numVarintBytes = Math.trunc(numBitsNeeded / 7);
	if (numBitsNeeded % 7 > 0) {
		numVarintBytes += 1;
	}

	return numVarintBytes;
};

function getSizeIncrement(value) {
	var newBytes = 0;
	if (value) {
		newBytes += 1; // (message index + wire type for index table)
		newBytes += calculateVarIntSize(value.length); // size of value length
		// value
		newBytes += value.length; // actual value length
	}

	return newBytes;
};

module.exports = getRecordSize;