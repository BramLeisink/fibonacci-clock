type Theme = {
	hour: string;
	minute: string;
	both: string;
};

export type Themes = Record<string, Theme>;

export interface Block {
	size: number;
	value: number;
	pos: [number, number];
}

export type Blocks = Block[];
