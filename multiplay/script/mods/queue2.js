class Queue
{
	constructor(q)
	{
		this.elements = {};
		this.head = 0;
		this.tail = 0;
	}

	get length()
	{
		return this.tail - this.head;
	}

	add(element)
	{
		this.elements[this.tail] = element;
		this.tail++;
	}

	get()
	{
		if (this.length)
		{
			const element = this.elements[this.head];
			delete this.elements[this.head];
			this.head++;
			return element;
		}
		return undefined;
	}

	isEmpty()
	{
		return (this.length == 0);
	}

	peek()
	{
		if (this.length)
		{
			return this.elements[this.head];
		}
		return undefined;
	}
	reset()
	{
		this.head = 0;
		this.tail = 0;
	}
}

