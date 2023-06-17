import React from "react";

function UserSearch({ searchKey, setSearchKey }) {
	const handleSearch = (e) => {
		setSearchKey(e.target.value);
	};
	return (
		<div className="relative">
			<input
				type="text"
				name="searchKey"
				placeholder="Search "
				className="rounded-xl w-full border-gray-300 pl-10 text-gray-500 h-14"
				value={searchKey}
				onChange={handleSearch}
			/>
			<i className="ri-search-2-line absolute top-4 left-4 text-gray-500"></i>
		</div>
	);
}

export default UserSearch;
