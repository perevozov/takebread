import React, { Component } from 'react';
import { Text, View, FlatList, Button, TouchableOpacity, GestureResponderEvent, TextInput, EventSubscriptionVendor, Pressable } from 'react-native';
import { ItemWithPosition, ListWithItems } from '../api/api';
import { apiClient } from '../App';


type ShoppingListViewProps = {
    listId: string
    onPressAdd?: () => void
}

type ShoppingListViewState = {
    adding: boolean
    newItemName: string
    list: ItemWithPosition[]
}

export class ShoppingListView extends React.Component<ShoppingListViewProps, ShoppingListViewState> {
    newItemInput: TextInput | null

    constructor(props: ShoppingListViewProps) {
        super(props)
        this.state = {
            adding: false,
            newItemName: '',
            list: [],
        }
        this.newItemInput = null
    }

    componentDidMount(): void {
        apiClient.list.getList(this.props.listId).then(response => {
            this.setState({
                list: response.data.items!
            })
        })
    }

    onPressAdd = () => {
        this.setState((prev) => {
            return {
                adding: !prev.adding
            }
        }, () => {
            if (this.state.adding) {
                if (this.newItemInput) {
                    console.log('focus')
                    this.newItemInput.focus()
                }
            }
        })
    }

    onPressOk = () => {
        const newItemTitle = this.state.newItemName;

        apiClient.list.addItem(this.props.listId, {
            title: this.state.newItemName
        }).then((response) => {
            this.setState((prev) => {
                return {
                    adding: false,
                    list: prev.list.concat({
                        title: newItemTitle
                    })
                }
            })
        })
    }

    onChangeNewItemName = (text: string) => {
        this.setState({
            newItemName: text
        })
    }

    renderItem({ item }: { item: ItemWithPosition }) {
        return (
            <Text style={styles.item}>{item.title}</Text>
        )
    }

    render(): React.ReactNode {
        return (
            <View>
                {this.state.list &&
                    <FlatList
                        data={this.state.list}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id!}
                    />
                }
                {this.state.adding
                    ? (
                        <View>
                            <TextInput
                                style={styles.input}
                                ref={input => this.newItemInput = input}
                                onChangeText={this.onChangeNewItemName}
                            />

                            <View>
                                <Button title='Add' onPress={this.onPressOk} />
                                <Button title='Cancel' onPress={this.onPressAdd} />
                            </View>
                        </View>
                    ) :
                    (
                        <Button title={this.state.adding ? 'Cancel' : 'Add'} onPress={this.onPressAdd} />
                    )
                }


            </View>
        )
    }
}

const styles = {
    item: {
        backgroundColor: '#f9c2ff',
        padding: 6,
        marginVertical: 1,
        marginHorizontal: 4,
    },
    input: {
        borderWidth: 1,
        padding: 6,
        margin: 4,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 14

    },
    button: {
        marginHorizontal: 10
    },
    title: {

    }
}