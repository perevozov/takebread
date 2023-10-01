import { DeviceEventEmitter, View, Text, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { ShoppingListView } from '../components/ShoppingList';

export class ViewListScreen extends React.Component<{ navigation: any, route: any }> {

    render() {
        return (
            <ShoppingListView listId={this.props.route.params.id}  onRefresh={()=>{}}/>
        )
    }
}