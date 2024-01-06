import React from 'react';
import Avatar from '@mui/material/Avatar';

function stringToColor(string) {
    if (!string) {
        return '#000';
    }

    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

const UserImage = ({ className, iconSize, name }) => {
    const safeName = name || 'Unknown User';

    const avatarSize = iconSize * 2;

    const avatarStyle = {
        backgroundColor: stringToColor(safeName),
        width: avatarSize,
        height: avatarSize,
        fontSize: iconSize,
    };

    const getInitials = (name) => {
        const parts = name.split(' ').filter(Boolean);
        let initials = '';

        if (parts.length > 0 && parts[0]) {
            initials += parts[0][0];
        }

        if (parts.length > 1 && parts[1]) {
            initials += parts[1][0];
        }

        return initials.toUpperCase();
    };


    const initials = getInitials(safeName);

    return (
        <Avatar className={className} style={avatarStyle}>
            {initials}
        </Avatar>
    );
};

export default UserImage;