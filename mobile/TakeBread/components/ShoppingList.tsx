import React, { Component } from 'react';
import { Text, View, FlatList, Button, TouchableOpacity, GestureResponderEvent, TextInput, EventSubscriptionVendor, Pressable, ScrollView, RefreshControl } from 'react-native';
import { ItemWithPosition, ListWithItems } from '../api/api';
import { apiClient } from '../App';


type ShoppingListViewProps = {
    listId: string
    onRefresh: () => void
}

type ShoppingListViewState = {
    adding: boolean
    isLoading: boolean,
    isError: boolean,
    newItemName: string
    list: ItemWithPosition[]
}

export class ShoppingListView extends React.Component<ShoppingListViewProps, ShoppingListViewState> {
    newItemInput: TextInput | null
    state = {
        adding: false,
        isLoading: false,
        isError: false,
        newItemName: '',
        list: [],
    }

    constructor(props: ShoppingListViewProps) {
        super(props)
        this.newItemInput = null
    }

    componentDidMount(): void {
        this.loadItems()
    }

    loadItems() {
        apiClient.list.getList(this.props.listId).then(response => {
            this.setState({
                list: response.data.items!,
                isLoading: false,
            })
        }).catch(e => {
            this.setState({
                isLoading: false,
                isError: true
            })
        })
    }

    onPressAdd = () => {
        this.setState(
            (prev) => {
                return {
                    adding: !prev.adding
                }
            },
            () => {
                if (this.state.adding) {
                    if (this.newItemInput) {
                        this.newItemInput.focus()
                    }
                }
            }
        )
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

    refresh() {
        console.log('refresh')
        this.setState({
            isLoading: true
        })
        this.loadItems()
    }

    render(): React.ReactNode {
        return (
            <View style={styles.mainContainer}>
                <RefreshControl style={styles.refreshControl} refreshing={this.state.isLoading} onRefresh={() => this.refresh()}>
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
                            <View style={styles.buttonsContainer}>
                                <Pressable style={styles.button} onPress={this.onPressAdd} >
                                    <Text style={styles.buttonText}>
                                        {this.state.adding ? 'Cancel' : 'Add'}
                                    </Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={() => this.setState({ list: [] })}>
                                    <Text style={styles.buttonText}>
                                        Clear
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    }
                </RefreshControl>
            </View>
        )
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        // contentAlign: "flex-start",
        backgroundColor: 'red',
    },
    refreshControl: {
        flex: 1,
        backgroundColor: 'blue',
        contentAlign: "flex-start",
    },
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
    buttonsContainer: {
        backgroundColor: 'green',
        // gap: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        // gap: 14
    },
    buttons: {
        flexDirection: "row",
        alignContent: "stretch",
        // gap: 14,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        // paddingHorizontal: 10,
        // flexGrow: 1,
        alignContent: "center",
    },
    buttonText: {
        backgroundColor: 'red',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    title: {

    }
}